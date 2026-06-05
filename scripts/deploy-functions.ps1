# Supprime d'éventuelles functions HTTPS partielles, puis redéploie les triggers Firestore.
$ErrorActionPreference = "Continue"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "Suppression des functions existantes (si présentes)..."
firebase functions:delete onContactMessageCreated onAnnonceurMessageCreated `
  --region northamerica-northeast1 --force 2>$null

Start-Sleep -Seconds 8

Write-Host "Déploiement..."
firebase deploy --only functions --force
