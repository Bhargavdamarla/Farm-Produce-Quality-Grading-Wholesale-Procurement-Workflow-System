@echo off
echo Setting environment variables for Local MySQL...

set DATABASE_URL=jdbc:mysql://localhost:3306/procurementdb?useSSL=false&serverTimezone=Asia/Kolkata
set DATABASE_USERNAME=root
set DATABASE_PASSWORD=admin

echo Environment variables set for Local MySQL!
echo Make sure your local MySQL is running on port 3306
echo Run your backend with: cd Backend && mvn spring-boot:run