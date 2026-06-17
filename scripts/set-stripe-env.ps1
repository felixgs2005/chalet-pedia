# Configure les variables Stripe sur les Cloud Functions (Cloud Run).
# Prerequis : gcloud auth login + fonctions Stripe deployees
$ErrorActionPreference = "Stop"
$ProjectId = "chaletpedia"
$Region = "northamerica-northeast1"
$Services = @(
  "createcheckoutsession",
  "createbillingportalsession",
  "stripewebhook"
)

$gcloud = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
if (-not (Test-Path $gcloud)) {
  throw "gcloud introuvable. Relancez le terminal apres installation du Google Cloud SDK."
}

function Get-LatestReadyImage([string]$Service) {
  $rev = & $gcloud run services describe $Service --region=$Region --project=$ProjectId --format="value(status.latestReadyRevisionName)"
  if ([string]::IsNullOrWhiteSpace($rev)) {
    throw "Aucune revision prete pour $Service. Lancez d'abord : firebase deploy --only functions:createCheckoutSession,functions:createBillingPortalSession,functions:stripeWebhook"
  }
  & $gcloud run revisions describe $rev --region=$Region --project=$ProjectId --format="value(spec.containers[0].image)"
}

function Get-SmtpEnvSuffix() {
  $sourceServices = @("requestpasswordresetcode", "onchaletlistingcreated")
  foreach ($source in $sourceServices) {
    try {
      $json = & $gcloud run services describe $source --region=$Region --project=$ProjectId --format=json 2>$null
      if (-not $json) { continue }
      $svc = $json | ConvertFrom-Json
      $envList = $svc.spec.template.spec.containers[0].env
      if (-not $envList) { continue }
      $keys = @("SMTP_USER", "SMTP_PASS", "SMTP_HOST", "SMTP_PORT", "SMTP_FROM")
      $pairs = @()
      foreach ($key in $keys) {
        $item = $envList | Where-Object { $_.name -eq $key }
        if ($item -and $item.value) {
          $pairs += "$key=$($item.value)"
        }
      }
      if ($pairs.Count -ge 2) {
        return "," + ($pairs -join ",")
      }
    } catch {
      continue
    }
  }
  return ""
}

& $gcloud config set project $ProjectId | Out-Null

$accounts = & $gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $accounts) {
  Write-Host "Connexion Google Cloud requise..." -ForegroundColor Yellow
  & $gcloud auth login
}

Write-Host ""
Write-Host "Variables Stripe pour ChaletPedia (mode test recommande au debut)" -ForegroundColor Cyan
Write-Host "Webhook URL a enregistrer dans Stripe :" -ForegroundColor DarkGray
Write-Host "  https://northamerica-northeast1-chaletpedia.cloudfunctions.net/stripeWebhook" -ForegroundColor DarkGray
Write-Host ""

$stripeSecret = Read-Host 'STRIPE_SECRET_KEY (sk_test_... ou sk_live_...)'
$stripeSecret = $stripeSecret.Trim()
if (-not $stripeSecret.StartsWith("sk_")) {
  throw "STRIPE_SECRET_KEY invalide (doit commencer par sk_)."
}

$priceChalets = Read-Host 'STRIPE_PRICE_CHALETS (price_... - Annonces chalets 90 CAD/an)'
$priceChalets = $priceChalets.Trim()
if (-not $priceChalets.StartsWith("price_")) {
  throw "STRIPE_PRICE_CHALETS invalide (doit commencer par price_)."
}

$priceServices = Read-Host 'STRIPE_PRICE_SERVICES (price_... - Annonces services 45 CAD/an)'
$priceServices = $priceServices.Trim()
if (-not $priceServices.StartsWith("price_")) {
  throw "STRIPE_PRICE_SERVICES invalide (doit commencer par price_)."
}

$webhookSecretInput = Read-Host 'STRIPE_WEBHOOK_SECRET (whsec_... - Entree vide si pas encore cree)'
$webhookSecret = $webhookSecretInput.Trim()

$appOriginInput = Read-Host 'APP_ORIGIN (Entree vide = https://chalet-pedia.vercel.app)'
$appOrigin = if ([string]::IsNullOrWhiteSpace($appOriginInput)) { "https://chalet-pedia.vercel.app" } else { $appOriginInput.Trim().TrimEnd("/") }

$envVars = "STRIPE_SECRET_KEY=$stripeSecret,STRIPE_PRICE_CHALETS=$priceChalets,STRIPE_PRICE_SERVICES=$priceServices,APP_ORIGIN=$appOrigin"
$smtpSuffix = Get-SmtpEnvSuffix
if ($smtpSuffix) {
  $envVars += $smtpSuffix
  Write-Host "Variables SMTP reprises d'un service existant (courriel de confirmation)." -ForegroundColor DarkGray
} else {
  Write-Host "SMTP non trouve - lancez scripts\set-smtp-env.ps1 pour activer les courriels d'abonnement." -ForegroundColor Yellow
}
if ($webhookSecret.StartsWith("whsec_")) {
  $envVars += ",STRIPE_WEBHOOK_SECRET=$webhookSecret"
} else {
  Write-Host "STRIPE_WEBHOOK_SECRET ignore pour l'instant - a ajouter apres creation du webhook Stripe." -ForegroundColor Yellow
}

foreach ($service in $Services) {
  Write-Host "Mise a jour $service ..."
  $image = Get-LatestReadyImage $service
  & $gcloud run services update $service --region=$Region --project=$ProjectId --image=$image --update-env-vars=$envVars
}

Write-Host ""
Write-Host "Termine. Testez /compte/abonnement/ puis verifiez Firestore users/{uid}.subscriptions" -ForegroundColor Green
if (-not $webhookSecret.StartsWith("whsec_")) {
  Write-Host ""
  Write-Host "Prochaine etape : Stripe Dashboard > Webhooks > ajouter l'URL ci-dessus" -ForegroundColor Yellow
  Write-Host "Evenements : checkout.session.completed, invoice.payment_succeeded, customer.subscription.updated, customer.subscription.deleted" -ForegroundColor Yellow
  Write-Host 'Puis relancez ce script avec le whsec_...' -ForegroundColor Yellow
}
