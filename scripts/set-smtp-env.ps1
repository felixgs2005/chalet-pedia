# Configure les variables SMTP sur les Cloud Functions (Cloud Run).
# Prerequis : gcloud auth login + fonctions deployees (firebase deploy --only functions)
$ErrorActionPreference = "Stop"
$ProjectId = "chaletpedia"
$Region = "northamerica-northeast1"
$Services = @(
  "oncontactmessagecreated",
  "onlistingcontactcreated",
  "onchaletlistingcreated",
  "onventelistingcreated",
  "onservicelistingcreated"
)

$gcloud = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
if (-not (Test-Path $gcloud)) {
  throw "gcloud introuvable. Relancez le terminal apres installation du Google Cloud SDK."
}

function Get-LatestReadyImage([string]$Service) {
  $rev = & $gcloud run services describe $Service --region=$Region --project=$ProjectId --format="value(status.latestReadyRevisionName)"
  if ([string]::IsNullOrWhiteSpace($rev)) {
    throw "Aucune revision prete pour $Service. Lancez d'abord : firebase deploy --only functions"
  }
  & $gcloud run revisions describe $rev --region=$Region --project=$ProjectId --format="value(spec.containers[0].image)"
}

& $gcloud config set project $ProjectId | Out-Null

$accounts = & $gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $accounts) {
  Write-Host "Connexion Google Cloud requise..." -ForegroundColor Yellow
  & $gcloud auth login
}

Write-Host ""
Write-Host "Variables SMTP pour ChaletPedia (Gmail = mot de passe d'application)" -ForegroundColor Cyan
Write-Host ""

$defaultUser = "wintechnologie830@gmail.com"
$smtpUserInput = Read-Host "SMTP_USER (Entree = $defaultUser)"
$smtpUser = if ([string]::IsNullOrWhiteSpace($smtpUserInput)) { $defaultUser } else { $smtpUserInput }
$smtpPass = Read-Host "SMTP_PASS (mot de passe d'application Gmail, obligatoire)" -AsSecureString
$smtpPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($smtpPass)
)
$smtpPassPlain = ($smtpPassPlain -replace '\s', '').Trim()
if ($smtpPassPlain.Length -lt 16) {
  throw "Mot de passe invalide ($($smtpPassPlain.Length) caracteres). Utilisez un mot de passe d'application Gmail (16 caracteres, sans espaces)."
}
$smtpFrom = Read-Host "SMTP_FROM (Entree = meme que SMTP_USER)"
if ([string]::IsNullOrWhiteSpace($smtpFrom)) { $smtpFrom = $smtpUser }

$envVars = "SMTP_USER=$smtpUser,SMTP_PASS=$smtpPassPlain,SMTP_HOST=smtp.gmail.com,SMTP_PORT=465,SMTP_FROM=$smtpFrom,APP_ORIGIN=https://chalet-pedia.vercel.app"

foreach ($service in $Services) {
  Write-Host "Mise a jour $service ..."
  $image = Get-LatestReadyImage $service
  & $gcloud run services update $service --region=$Region --project=$ProjectId --image=$image --update-env-vars=$envVars
}

Write-Host ""
Write-Host "Termine. Testez une nouvelle annonce puis verifiez l'email admin." -ForegroundColor Green
