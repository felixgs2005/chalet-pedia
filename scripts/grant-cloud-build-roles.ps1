# Ajoute les rôles requis au compte Compute Engine default (premier deploy Cloud Functions 2e gen).
# Prérequis : gcloud auth login (même compte Owner du projet Chaletpedia)

$ErrorActionPreference = "Stop"
$ProjectId = "chaletpedia"
$ProjectNumber = "489247880895"
$ComputeSa = "serviceAccount:${ProjectNumber}-compute@developer.gserviceaccount.com"

$gcloud = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
if (-not (Test-Path $gcloud)) {
  $gcloud = "${env:ProgramFiles(x86)}\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
}
if (-not (Test-Path $gcloud)) {
  throw "gcloud introuvable. Installez Google Cloud SDK ou relancez le terminal."
}

& $gcloud config set project $ProjectId | Out-Null

$accounts = & $gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $accounts) {
  Write-Host "Connectez-vous d'abord : gcloud auth login" -ForegroundColor Yellow
  & $gcloud auth login
}

$roles = @(
  "roles/cloudbuild.builds.builder",
  "roles/artifactregistry.writer",
  "roles/storage.objectViewer",
  "roles/logging.logWriter"
)

foreach ($role in $roles) {
  Write-Host "Attribution $role -> Compute Engine default SA..."
  & $gcloud projects add-iam-policy-binding $ProjectId `
    --member=$ComputeSa `
    --role=$role `
    --condition=None 2>&1 | Out-Null
}

Write-Host ""
Write-Host "Terminé. Attendez 2-3 minutes puis :" -ForegroundColor Green
Write-Host "  firebase functions:delete onContactMessageCreated onAnnonceurMessageCreated --region northamerica-northeast1 --force"
Write-Host "  firebase deploy --only functions --force"
