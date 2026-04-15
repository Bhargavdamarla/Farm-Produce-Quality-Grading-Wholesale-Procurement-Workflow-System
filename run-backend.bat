@echo off
REM Backend Runner Script - Ensures environment variables are set
REM This prevents accidental changes to application.properties

echo Setting up environment variables...
set DATABASE_URL=jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true
set DATABASE_USERNAME=avnadmin
REM Set your Aiven password below or use environment variable
set DATABASE_PASSWORD=YOUR_AIVEN_PASSWORD_HERE

echo Environment variables configured securely.
echo Starting backend...
cd Backend
mvn spring-boot:run