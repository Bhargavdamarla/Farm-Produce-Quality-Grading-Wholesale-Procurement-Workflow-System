@echo off
echo Setting environment variables for Aiven Cloud MySQL...

set DATABASE_URL=jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?serverSslMode=REQUIRED&allowPublicKeyRetrieval=true&connectTimeout=30000&socketTimeout=30000
set DATABASE_USERNAME=avnadmin
set DATABASE_PASSWORD=AVNS_nILG52yp8jnwCZj-xYU

echo Environment variables set for Aiven Cloud!
echo Run your backend with: cd Backend && mvn spring-boot:run