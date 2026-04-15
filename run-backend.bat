@echo off
REM Backend Runner Script - Ensures environment variables are set
REM This prevents accidental changes to application.properties

echo Setting up environment variables...
set DATABASE_URL=jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true
set DATABASE_USERNAME=avnadmin
set DATABASE_PASSWORD=AVNS_nILG52yp8jnwCZj-xYU

echo Environment variables configured securely.
echo Starting backend...
cd Backend
mvn spring-boot:run