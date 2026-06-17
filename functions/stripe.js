const Stripe = require("stripe");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { sendSubscriptionConfirmationEmail } = require("./SendEmail");

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

function getSubscriptionPeriodEnd(subscription) {
  if (!subscription) return null;

  const legacy = Number(subscription.current_period_end);
  if (Number.isFinite(legacy) && legacy > 0) {
    return legacy;
  }

  const items = subscription.items?.data || [];
  let latestEnd = null;
  for (const item of items) {
    const end = Number(item.current_period_end);
    if (Number.isFinite(end) && end > 0 && (latestEnd === null || end > latestEnd)) {
      latestEnd = end;
    }
  }
  return latestEnd;
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

  const periodEndUnix = getSubscriptionPeriodEnd(subscription);
  const subData = {
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId || "",
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (periodEndUnix) {
    subData.currentPeriodEnd = Timestamp.fromMillis(periodEndUnix * 1000);
  }

  await db.collection("users").doc(uid).set(
    {
      subscriptions: {
        [plan]: subData,
      },
    },
    { merge: true }
  );
}

function formatInvoiceAmount(cents, currency) {
  const amount = (Number(cents || 0) / 100).toFixed(2);
  if (String(currency || "").toLowerCase() === "cad") {
    return `${amount} $ CA`;
  }
  return `${amount} ${String(currency || "").toUpperCase()}`;
}

async function resolveInvoiceCustomerEmail(stripe, invoice) {
  if (invoice.customer_email) {
    return invoice.customer_email;
  }
  if (!invoice.customer) {
    return null;
  }
  const customer =
    typeof invoice.customer === "string"
      ? await stripe.customers.retrieve(invoice.customer)
      : invoice.customer;
  return customer.email || null;
}

async function resolvePlanFromInvoice(stripe, invoice) {
  const subRef = invoice.subscription;
  if (!subRef) return null;

  const subscription =
    typeof subRef === "string"
      ? await stripe.subscriptions.retrieve(subRef)
      : subRef;

  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  return subscription.metadata?.plan || planFromPriceId(priceId) || null;
}

/**
 * Envoie une seule fois l'email de confirmation (premier paiement ou renouvellement).
 */
async function maybeSendSubscriptionInvoiceEmail(stripe, invoiceRef) {
  const invoiceId =
    typeof invoiceRef === "string" ? invoiceRef : invoiceRef?.id || null;
  if (!invoiceId) return;

  const db = getFirestore();
  const sentRef = db.collection("subscriptionInvoiceEmails").doc(invoiceId);

  try {
    await sentRef.create({
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    if (err.code === 6 || /already exists/i.test(String(err.message))) {
      return;
    }
    throw err;
  }

  try {
    const invoice =
      typeof invoiceRef === "string"
        ? await stripe.invoices.retrieve(invoiceRef, { expand: ["subscription"] })
        : invoiceRef;

    if (invoice.status !== "paid") {
      await sentRef.delete();
      return;
    }

    const billingReason = invoice.billing_reason || "";
    if (
      billingReason !== "subscription_create" &&
      billingReason !== "subscription_cycle"
    ) {
      await sentRef.delete();
      return;
    }

    const plan = await resolvePlanFromInvoice(stripe, invoice);
    if (!plan || !PLAN_KEYS.has(plan)) {
      await sentRef.delete();
      return;
    }

    const email = await resolveInvoiceCustomerEmail(stripe, invoice);
    if (!email) {
      await sentRef.delete();
      return;
    }

    const subscription =
      typeof invoice.subscription === "string"
        ? await stripe.subscriptions.retrieve(invoice.subscription)
        : invoice.subscription;

    const periodEndUnix = getSubscriptionPeriodEnd(subscription);

    await sendSubscriptionConfirmationEmail({
      email,
      plan,
      amountFormatted: formatInvoiceAmount(invoice.amount_paid, invoice.currency),
      invoiceUrl: invoice.hosted_invoice_url || "",
      invoicePdfUrl: invoice.invoice_pdf || "",
      periodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
      isRenewal: billingReason === "subscription_cycle",
    });

    await sentRef.set(
      {
        email,
        plan,
        sentAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("maybeSendSubscriptionInvoiceEmail:", invoiceId, err);
    try {
      await sentRef.delete();
    } catch (deleteErr) {
      console.error("maybeSendSubscriptionInvoiceEmail cleanup:", deleteErr);
    }
  }
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
      // TPS + TVQ (Québec) : calcul automatique via Stripe Tax selon l'adresse de facturation.
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
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
              session.subscription,
              { expand: ["latest_invoice"] }
            );
            try {
              await syncSubscriptionToFirestore(subscription);
            } catch (syncErr) {
              console.error("syncSubscriptionToFirestore:", syncErr);
            }

            const latestInvoice = subscription.latest_invoice;
            if (latestInvoice) {
              const invoiceId =
                typeof latestInvoice === "string"
                  ? latestInvoice
                  : latestInvoice.id;
              await maybeSendSubscriptionInvoiceEmail(stripe, invoiceId);
            } else if (session.invoice) {
              await maybeSendSubscriptionInvoiceEmail(stripe, session.invoice);
            }
          }
          break;
        }
        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          await maybeSendSubscriptionInvoiceEmail(stripe, invoice);
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          try {
            await syncSubscriptionToFirestore(event.data.object);
          } catch (syncErr) {
            console.error("syncSubscriptionToFirestore:", syncErr);
          }
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
