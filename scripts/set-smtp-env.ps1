# Configure les variables SMTP sur la Cloud Function contact (Cloud Run).
# Prérequis : gcloud auth login (compte Owner du projet)

$ErrorActionPreference = "Stop"
$ProjectId = "chaletpedia"
$Region = "northamerica-northeast1"
$Services = @("oncontactmessagecreated", "onlistingcontactcreated")

$gcloud = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
if (-not (Test-Path $gcloud)) {
  throw "gcloud introuvable. Relancez le terminal après installation du Google Cloud SDK."
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

$defaultUser = "adeltamani82@gmail.com"
$smtpUserInput = Read-Host "SMTP_USER (Entree = $defaultUser)"
$smtpUser = if ([string]::IsNullOrWhiteSpace($smtpUserInput)) { $defaultUser } else { $smtpUserInput }
$smtpPass = Read-Host "SMTP_PASS (mot de passe d'application Gmail, obligatoire)" -AsSecureString
$smtpPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($smtpPass)
)
$smtpFrom = Read-Host "SMTP_FROM (Entree = meme que SMTP_USER)"
if ([string]::IsNullOrWhiteSpace($smtpFrom)) { $smtpFrom = $smtpUser }

$envVars = "SMTP_USER=$smtpUser,SMTP_PASS=$smtpPassPlain,SMTP_HOST=smtp.gmail.com,SMTP_PORT=465,SMTP_FROM=$smtpFrom,APP_ORIGIN=https://chalet-pedia.vercel.app"

foreach ($service in $Services) {
  Write-Host "Mise a jour $service ..."
  & $gcloud run services update $service `
    --region=$Region `
    --project=$ProjectId `
    --update-env-vars=$envVars
}

Write-Host ""
Write-Host "Termine. Testez /contact/ puis verifiez contactMessages.statut = envoye" -ForegroundColor Green
