# Backend Runner Script - Ensures environment variables are set
# This prevents accidental changes to application.properties

Write-Host "Setting up environment variables..." -ForegroundColor Green

# Set environment variables securely (these are not stored in files)
$env:DATABASE_URL = "jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true"
$env:DATABASE_USERNAME = "avnadmin"
# Set your Aiven password below or use environment variable
$env:DATABASE_PASSWORD = "YOUR_AIVEN_PASSWORD_HERE"

Write-Host "Environment variables configured securely." -ForegroundColor Green
Write-Host "Starting backend..." -ForegroundColor Yellow

# Change to Backend directory and run
Set-Location -Path ".\Backend"
mvn spring-boot:run