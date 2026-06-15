# Met a jour uniquement SMTP_PASS (apres set-smtp-env ou configuration partielle).
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

$smtpUser = "wintechnologie830@gmail.com"
$pass = Read-Host "Mot de passe d'application Gmail pour $smtpUser" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
)
$plain = ($plain -replace '\s', '').Trim()
if ($plain.Length -lt 16) {
  throw "Mot de passe invalide ($($plain.Length) caracteres). Utilisez un mot de passe d'application Gmail (16 caracteres, sans espaces)."
}

foreach ($svc in $Services) {
  $image = Get-LatestReadyImage $svc
  & $gcloud run services update $svc --region=$Region --project=$ProjectId --image=$image --update-env-vars="SMTP_PASS=$plain"
  Write-Host "OK: $svc"
}
