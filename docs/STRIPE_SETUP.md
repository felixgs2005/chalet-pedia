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
> Les prix sont **hors taxes** : la TPS et la TVQ s'ajoutent au paiement (voir section 2b).

---

## 2b. Activer Stripe Tax (TPS + TVQ)

Les taxes québécoises sont calculées automatiquement au checkout et à chaque renouvellement.

1. Stripe → **Settings** → **Tax** → activer **Stripe Tax**
2. Indiquer l'adresse de votre entreprise (Québec)
3. Ajouter les enregistrements fiscaux :
   - **TPS** (fédéral, 5 %)
   - **TVQ** (Québec, 9,975 %)
4. Vérifier que les prix produits sont en **tax exclusive** (hors taxes) — c'est le comportement par défaut

Au checkout Stripe, le client saisit son **adresse de facturation** ; le total affiché inclut alors TPS + TVQ. Exemples au Québec :

| Plan | Hors taxes | Total estimé (Québec) |
|------|------------|------------------------|
| Chalets | 90,00 $ | ~103,93 $ |
| Services | 45,00 $ | ~51,96 $ |

Après activation de Stripe Tax, redéployer `createCheckoutSession` :

```bash
firebase deploy --only functions:createCheckoutSession
```

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
     - `invoice.payment_succeeded` (confirmation par courriel + renouvellements annuels)
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

## 7b. Courriel de confirmation avec facture

Après chaque paiement d'abonnement (premier achat ou renouvellement annuel), `stripeWebhook` envoie un courriel au client avec :

- le montant payé et la date de fin de période ;
- un lien vers la facture Stripe en ligne ;
- un lien pour télécharger le PDF de la facture.

**Prérequis :**

1. Variables SMTP sur `stripewebhook` (même config que les autres functions) :
   ```powershell
   cd scripts
   .\set-smtp-env.ps1
   ```
   Le script inclut désormais `stripewebhook`.
2. Événement webhook **`invoice.payment_succeeded`** ajouté dans Stripe (section 6).
3. Redéployer `stripeWebhook` après modification du code :
   ```bash
   firebase deploy --only functions:stripeWebhook
   ```

---

## 8. Tester en mode Test

1. Se connecter sur le site avec un compte utilisateur
2. Aller sur **`/compte/abonnement/`**
3. Cliquer **S'abonner** (chalets ou services)
4. Payer avec une carte test : `4242 4242 4242 4242`, date future, CVC quelconque
5. Vérifier après paiement :
   - Retour sur `/compte/abonnement/?success=1`
   - Firestore → `users/{uid}` → `subscriptions.chalets` ou `subscriptions.services` avec `status: "active"`
   - Courriel de confirmation reçu (liens facture en ligne + PDF)
6. Tester la publication :
   - **Chalets** : `/submit-listing/details/` (abonnement chalets requis)
   - **Services** : **Inscrivez vos services** (abonnement services requis)
7. Tester **Gérer la facturation** (annulation) et vérifier la mise à jour Firestore

Cartes de test : [https://docs.stripe.com/testing](https://docs.stripe.com/testing)

---

## 9. Passer en production — recevoir de l'argent réel

En **mode Test** (`sk_test_...`, carte `4242 4242 4242 4242`), **aucun vrai argent** n'est encaissé. Pour que le propriétaire du site reçoive l'argent sur son compte bancaire, il faut activer le **mode Live** et lier un compte bancaire à Stripe.

> Le code ChaletPedia (checkout, webhook, abonnements, courriels) est déjà prêt. Cette section décrit uniquement la configuration Stripe et Firebase — **aucune modification de code n'est requise**.

### 9.1 Compléter le compte Stripe (obligatoire)

Stripe Dashboard → **Settings** → **Business** / **Compte**

Renseigner :

- nom de l'entreprise (ou nom légal)
- adresse au Québec
- numéros de taxes si demandés (TPS / TVQ)
- **compte bancaire canadien** où Stripe versera les fonds
- pièce d'identité du représentant (vérification KYC)

Sans cette étape, Stripe ne peut pas virer l'argent sur le compte bancaire.

### 9.2 Passer en mode Live

Interrupteur **Test / Live** en haut à droite du Dashboard → passer en **Live**.

Tout ce qui est configuré ensuite (produits, clés API, webhooks, Stripe Tax) concerne les **vrais** paiements.

### 9.3 Recréer les produits et prix en Live

Les IDs `price_...` du mode Test **ne fonctionnent pas** en Live. Recréer les deux produits (section 2) :

| Produit | Prix hors taxes | Fréquence |
|---------|-----------------|-----------|
| Annonces chalets | 90,00 $ CAD | Annuel |
| Annonces services | 45,00 $ CAD | Annuel |

Copier les **nouveaux** IDs `price_...` (mode Live).

### 9.4 Activer Stripe Tax en Live

Stripe → **Settings** → **Tax** → activer **Stripe Tax** aussi en **mode Live** :

- adresse de l'entreprise
- enregistrements **TPS** (5 %) et **TVQ** (9,975 %)

Sans cela, les taxes ne seront pas calculées correctement au checkout en production.

### 9.5 Mettre à jour les variables Firebase (Cloud Functions)

Remplacer les valeurs **test** par les valeurs **live** sur les services Cloud Run :

- `createCheckoutSession`
- `createBillingPortalSession`
- `stripeWebhook`

| Variable | Valeur Live |
|----------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_PRICE_CHALETS` | `price_...` (live) |
| `STRIPE_PRICE_SERVICES` | `price_...` (live) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (webhook live) |
| `APP_ORIGIN` | URL de production du site |

**Script PowerShell :**

```powershell
cd scripts
.\set-stripe-env.ps1
```

Entrer les clés et IDs **live** lorsque le script le demande. Le script conserve les variables SMTP si elles existent déjà.

### 9.6 Créer un webhook Live

Stripe → **Developers** → **Webhooks** → **Add endpoint** (en mode **Live**) :

- **URL** : celle de `stripeWebhook` (déjà déployée — voir section 6)
- **Événements** :
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Copier le nouveau **Signing secret** `whsec_...` (live) et l'ajouter dans `STRIPE_WEBHOOK_SECRET`.

### 9.7 Activer le portail client en Live

Stripe → **Settings** → **Billing** → **Customer portal** (mode Live)

- Activer le portail
- Autoriser : voir factures, mettre à jour la carte, annuler l'abonnement

Utilisé par **Gérer la facturation** sur `/compte/abonnement/`.

### 9.8 Comment l'argent arrive sur le compte bancaire

1. Un utilisateur paie sur `/compte/abonnement/` avec une **carte réelle**
2. Stripe encaisse le montant (ex. ~103,93 $ pour chalets au Québec, taxes incluses)
3. Stripe prélève ses **frais de transaction** (environ 2,9 % + 0,30 $ par transaction au Canada — vérifier sur votre compte Stripe)
4. Le **solde net** est versé sur le compte bancaire lié selon le **calendrier de paiements** Stripe (souvent tous les 2 à 7 jours ouvrables selon l'historique du compte)

Suivi dans Stripe Dashboard → **Balance** / **Payouts** (Virements).

### 9.9 Checklist avant d'ouvrir aux vrais clients

- [ ] Compte Stripe vérifié + compte bancaire canadien lié
- [ ] Mode **Live** activé
- [ ] 2 prix live créés (90 $ et 45 $ hors taxes)
- [ ] Stripe Tax live activé (TPS + TVQ)
- [ ] Variables `sk_live_`, `price_...`, `whsec_...` sur Firebase / Cloud Run
- [ ] Webhook live configuré et testé (événements en vert)
- [ ] Portail client live activé
- [ ] Variables SMTP sur `stripewebhook` (courriels de confirmation)
- [ ] Site en production sur l'URL réelle (`APP_ORIGIN`)
- [ ] Test avec **votre propre carte** (petit montant réel ; remboursement possible depuis le Dashboard si besoin)

### 9.10 Notes légales et fiscales

- Vous devez être enregistré pour collecter la **TPS** et la **TVQ** si vous dépassez les seuils d'inscription
- Les factures Stripe (PDF) servent de preuve pour la comptabilité
- Conserver les accès au Dashboard Stripe et les exports pour les déclarations fiscales
- Les montants affichés sur le site (`90+taxes`, `45+taxes`) sont **hors taxes** ; le total exact est calculé par Stripe au checkout selon l'adresse du client

---

## Récapitulatif

| Déjà dans le code | À faire manuellement |
|-------------------|----------------------|
| Page `/compte/abonnement/` | Compte Stripe |
| Checkout + portail + webhook | 2 produits/prix annuels |
| Blocage publication sans abonnement | Variables Firebase |
| Règles Firestore | Déploiement functions + rules |
| Modale abonnement services | Webhook Stripe |
| Courriel confirmation + facture | Portail client Stripe |
| Taxes TPS/TVQ (Stripe Tax) | Activation compte + compte bancaire |
| | Passage mode Live (section 9) |

---

## Notes techniques

- Pas de clé publique Stripe (`pk_...`) côté React : paiement via redirection **Checkout** (serveur).
- Functions concernées : `createCheckoutSession`, `createBillingPortalSession`, `stripeWebhook` (région `northamerica-northeast1`).
- Affichage des prix UI : `src/config/subscriptionPlans.js` (à aligner si tu changes les montants dans Stripe).
