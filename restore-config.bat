@echo off
REM Restore Secure Application Properties
REM This script restores the secure configuration if it gets accidentally modified

echo Checking application.properties security...

REM Check if the file contains hardcoded credentials
findstr /C:"mysql-3ee21df4-saibhargavdamarla-3733" "Backend\src\main\resources\application.properties" >nul
if %errorlevel% equ 0 (
    echo WARNING: Found hardcoded credentials in application.properties!
    echo Restoring secure configuration...
    copy "Backend\src\main\resources\application.properties.template" "Backend\src\main\resources\application.properties"
    echo Secure configuration restored.
) else (
    echo Application.properties is secure ✓
)

echo.
echo To restore from template manually, run:
echo copy Backend\src\main\resources\application.properties.template Backend\src\main\resources\application.properties