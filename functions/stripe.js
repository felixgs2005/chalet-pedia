const Stripe = require("stripe");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");

const PLAN_KEYS = new Set(["chalets", "services"]);
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquante (variables Cloud Functions).");
  }
  return new Stripe(key);
}

function getPriceId(plan) {
  if (plan === "chalets") return process.env.STRIPE_PRICE_CHALETS || "";
  if (plan === "services") return process.env.STRIPE_PRICE_SERVICES || "";
  return "";
}

function planFromPriceId(priceId) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_CHALETS) return "chalets";
  if (priceId === process.env.STRIPE_PRICE_SERVICES) return "services";
  return null;
}

function appOrigin() {
  return (process.env.APP_ORIGIN || "https://chalet-pedia.vercel.app").replace(/\/$/, "");
}

async function getOrCreateStripeCustomer(db, uid, email) {
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();
  const data = snap.data() || {};

  if (data.stripeCustomerId) {
    return data.stripeCustomerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: email || undefined,
    metadata: { firebaseUid: uid },
  });

  await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
  return customer.id;
}

async function syncSubscriptionToFirestore(subscription) {
  const db = getFirestore();
  const uid =
    subscription.metadata?.firebaseUid ||
    subscription.metadata?.firebaseUID ||
    null;
  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  const plan =
    subscription.metadata?.plan || planFromPriceId(priceId) || null;

  if (!uid || !plan || !PLAN_KEYS.has(plan)) {
    console.warn("syncSubscription: uid ou plan manquant", subscription.id);
    return;
  }

  const subData = {
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId || "",
    currentPeriodEnd: Timestamp.fromMillis(
      subscription.current_period_end * 1000
    ),
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await db.collection("users").doc(uid).set(
    {
      subscriptions: {
        [plan]: subData,
      },
    },
    { merge: true }
  );
}

function createStripeHandlers(region) {
  const createCheckoutSession = onCall({ region }, async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }

    const plan = String(request.data?.plan || "").trim();
    if (!PLAN_KEYS.has(plan)) {
      throw new HttpsError("invalid-argument", "Plan d'abonnement invalide.");
    }

    const priceId = getPriceId(plan);
    if (!priceId) {
      throw new HttpsError(
        "failed-precondition",
        "Stripe n'est pas configuré pour ce plan (STRIPE_PRICE_*)."
      );
    }

    const db = getFirestore();
    const uid = request.auth.uid;
    const email = request.auth.token.email || "";
    const userSnap = await db.collection("users").doc(uid).get();
    const existing = userSnap.data()?.subscriptions?.[plan];

    if (existing && ACTIVE_STATUSES.has(existing.status)) {
      throw new HttpsError(
        "already-exists",
        "Vous avez déjà un abonnement actif pour ce plan."
      );
    }

    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomer(db, uid, email);
    const origin = appOrigin();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      // Abonnement récurrent annuel — prélèvement automatique à chaque échéance.
      success_url: `${origin}/compte/abonnement/?success=1&plan=${plan}`,
      cancel_url: `${origin}/compte/abonnement/?canceled=1&plan=${plan}`,
      client_reference_id: uid,
      metadata: { firebaseUid: uid, plan },
      subscription_data: {
        metadata: { firebaseUid: uid, plan },
      },
    });

    if (!session.url) {
      throw new HttpsError("internal", "Impossible de créer la session Stripe.");
    }

    return { url: session.url };
  });

  const createBillingPortalSession = onCall({ region }, async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }

    const db = getFirestore();
    const userSnap = await db.collection("users").doc(request.auth.uid).get();
    const customerId = userSnap.data()?.stripeCustomerId;

    if (!customerId) {
      throw new HttpsError(
        "failed-precondition",
        "Aucun abonnement Stripe associé à ce compte."
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appOrigin()}/compte/abonnement/`,
    });

    return { url: session.url };
  });

  const stripeWebhook = onRequest({ region }, async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET manquante");
      res.status(500).send("Webhook non configuré");
      return;
    }

    const stripe = getStripe();
    const signature = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    } catch (err) {
      console.error("stripeWebhook signature:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (session.mode === "subscription" && session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription
            );
            await syncSubscriptionToFirestore(subscription);
          }
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await syncSubscriptionToFirestore(event.data.object);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("stripeWebhook handler:", err);
      res.status(500).send("Webhook handler failed");
      return;
    }

    res.json({ received: true });
  });

  return { createCheckoutSession, createBillingPortalSession, stripeWebhook };
}

module.exports = { createStripeHandlers };
