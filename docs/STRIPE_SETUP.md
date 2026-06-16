# Mise en place Stripe — ChaletPedia

Checklist pour activer les abonnements **Chalets** (90 $/an) et **Services** (45 $/an), avec renouvellement automatique.

Le code est déjà dans le projet (frontend, Cloud Functions, règles Firestore). Il reste surtout la configuration Stripe et le déploiement Firebase.

---

## 1. Créer / ouvrir ton compte Stripe

1. Aller sur [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Commencer en **mode Test** (interrupteur en haut à droite)
3. Compléter les infos de compte si Stripe le demande (nécessaire pour passer en production plus tard)

---

## 2. Créer les 2 produits et prix annuels

Stripe → **Produits** → **Ajouter un produit**

### Produit A — Chalets

- Nom : ex. `Annonces chalets ChaletPedia`
- Prix : **90,00 $ CAD**
- Type : **Récurrent**
- Fréquence : **Annuel**
- Copier l’ID du prix : `price_...` → variable `STRIPE_PRICE_CHALETS`

### Produit B — Services

- Nom : ex. `Annonces services ChaletPedia`
- Prix : **45,00 $ CAD** (ajustable)
- Type : **Récurrent**
- Fréquence : **Annuel**
- Copier l’ID : `price_...` → variable `STRIPE_PRICE_SERVICES`

> **Important :** choisir **Recurring / Yearly**, pas un paiement unique.

---

## 3. Récupérer les clés Stripe

Stripe → **Developers** → **API keys**

- **Secret key** (mode test) : `sk_test_...` → `STRIPE_SECRET_KEY`

---

## 4. Configurer les variables Firebase (Cloud Functions)

Firebase Console → projet **chaletpedia** → **Functions** → **Environment variables**

| Variable | Valeur |
|----------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_PRICE_CHALETS` | `price_...` |
| `STRIPE_PRICE_SERVICES` | `price_...` |
| `APP_ORIGIN` | `https://chalet-pedia.vercel.app` |

`STRIPE_WEBHOOK_SECRET` sera ajouté à l’étape 6.

Référence aussi dans `.env.example` (commentaires uniquement — les secrets restent sur Firebase).

---

## 5. Déployer les Cloud Functions et les règles Firestore

```powershell
cd c:\Users\Admin\Documents\ProjetChaletStage2026\chalet-pedia

firebase deploy --only firestore:rules

firebase deploy --only functions:createCheckoutSession,functions:createBillingPortalSession,functions:stripeWebhook
```

Sans ce déploiement, le bouton **S'abonner** sur `/compte/abonnement/` ne redirigera pas vers Stripe.

---

## 6. Créer le webhook Stripe

1. Déployer `stripeWebhook` (étape 5)
2. Firebase Console → **Functions** → **`stripeWebhook`** → copier l’**URL HTTPS** (Cloud Run), ex. :  
   `https://stripewebhook-xxxxx-northamerica-northeast1.run.app`
3. Stripe → **Developers** → **Webhooks** → **Add endpoint**
   - URL : celle de `stripeWebhook`
   - Événements :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
4. Copier le **Signing secret** : `whsec_...`
5. L’ajouter sur Firebase : **`STRIPE_WEBHOOK_SECRET`**
6. **Redéployer** les functions Stripe pour prendre en compte la variable

---

## 7. Activer le portail client Stripe

Stripe → **Settings** → **Billing** → **Customer portal**

- Activer le portail
- Autoriser : voir factures, mettre à jour la carte, annuler l’abonnement

Utilisé par **Gérer la facturation** sur `/compte/abonnement/`.

---

## 8. Tester en mode Test

1. Se connecter sur le site avec un compte utilisateur
2. Aller sur **`/compte/abonnement/`**
3. Cliquer **S'abonner** (chalets ou services)
4. Payer avec une carte test : `4242 4242 4242 4242`, date future, CVC quelconque
5. Vérifier après paiement :
   - Retour sur `/compte/abonnement/?success=1`
   - Firestore → `users/{uid}` → `subscriptions.chalets` ou `subscriptions.services` avec `status: "active"`
6. Tester la publication :
   - **Chalets** : `/submit-listing/details/` (abonnement chalets requis)
   - **Services** : **Inscrivez vos services** (abonnement services requis)
7. Tester **Gérer la facturation** (annulation) et vérifier la mise à jour Firestore

Cartes de test : [https://docs.stripe.com/testing](https://docs.stripe.com/testing)

---

## 9. Passer en production

1. Stripe → **Live mode**
2. Recréer les 2 prix en live (IDs `price_...` différents)
3. Remplacer sur Firebase :
   - `STRIPE_SECRET_KEY` → `sk_live_...`
   - `STRIPE_PRICE_CHALETS` / `STRIPE_PRICE_SERVICES` → IDs live
4. Créer un **nouveau webhook live** (même URL function, nouveau `whsec_...`)
5. Redéployer les functions Stripe
6. Finaliser l’activation du compte Stripe (identité, compte bancaire)

---

## Récapitulatif

| Déjà dans le code | À faire manuellement |
|-------------------|----------------------|
| Page `/compte/abonnement/` | Compte Stripe |
| Checkout + portail + webhook | 2 produits/prix annuels |
| Blocage publication sans abonnement | Variables Firebase |
| Règles Firestore | Déploiement functions + rules |
| Modale abonnement services | Webhook Stripe |
| | Portail client Stripe |
| | Tests puis passage live |

---

## Notes techniques

- Pas de clé publique Stripe (`pk_...`) côté React : paiement via redirection **Checkout** (serveur).
- Functions concernées : `createCheckoutSession`, `createBillingPortalSession`, `stripeWebhook` (région `northamerica-northeast1`).
- Affichage des prix UI : `src/config/subscriptionPlans.js` (à aligner si tu changes les montants dans Stripe).
