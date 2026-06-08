# Ajoute uniquement SMTP_PASS (apres set-smtp-env ou configuration partielle).
$ErrorActionPreference = "Stop"
$gcloud = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
$smtpUser = "adeltamani82@gmail.com"
$pass = Read-Host "Mot de passe d'application Gmail pour $smtpUser" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
)
$plain = ($plain -replace '\s', '').Trim()
if ($plain.Length -lt 16) {
  throw "Mot de passe invalide ($($plain.Length) caracteres). Utilisez un mot de passe d'application Gmail (16 caracteres, sans espaces)."
}
foreach ($svc in @("oncontactmessagecreated", "onlistingcontactcreated")) {
  & $gcloud run services update $svc `
    --region=northamerica-northeast1 `
    --project=chaletpedia `
    --update-env-vars="SMTP_PASS=$plain"
  Write-Host "OK: $svc"
}
