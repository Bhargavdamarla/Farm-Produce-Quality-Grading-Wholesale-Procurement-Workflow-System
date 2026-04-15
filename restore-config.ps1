# Restore Secure Application Properties
# This script restores the secure configuration if it gets accidentally modified

Write-Host "Checking application.properties security..." -ForegroundColor Yellow

# Check if the file contains hardcoded credentials
$content = Get-Content "Backend\src\main\resources\application.properties" -Raw
if ($content -match "mysql-3ee21df4-saibhargavdamarla-3733") {
    Write-Host "WARNING: Found hardcoded credentials in application.properties!" -ForegroundColor Red
    Write-Host "Restoring secure configuration..." -ForegroundColor Yellow
    Copy-Item "Backend\src\main\resources\application.properties.template" "Backend\src\main\resources\application.properties" -Force
    Write-Host "Secure configuration restored." -ForegroundColor Green
} else {
    Write-Host "Application.properties is secure ✓" -ForegroundColor Green
}

Write-Host ""
Write-Host "To restore from template manually, run:" -ForegroundColor Cyan
Write-Host "Copy-Item Backend\src\main\resources\application.properties.template Backend\src\main\resources\application.properties -Force"