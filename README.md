# Farm Produce Quality Grading & Wholesale Procurement System

## � Security Protection

**⚠️ CRITICAL: Database configuration is protected against accidental changes!**

### Automatic Protection
- `application.properties` uses environment variables only (no hardcoded credentials)
- VS Code formatters are disabled for properties files
- Template backup created: `Backend/src/main/resources/application.properties.template`

### If Configuration Gets Modified
Run the restore script:
```bash
# Windows Batch
restore-config.bat

# Windows PowerShell
.\restore-config.ps1
```

Or manually restore:
```bash
copy Backend\src\main\resources\application.properties.template Backend\src\main\resources\application.properties
```

### Why This Protection Exists
- Prevents accidental exposure of database credentials on GitHub
- Protects against VS Code formatters modifying the file
- Guards against Git line ending conversions
- Ensures consistent secure configuration across environments

## �🚀 Quick Start

### Backend Setup

**⚠️ IMPORTANT: Never modify `Backend/src/main/resources/application.properties` directly!**

The database configuration uses environment variables for security. Follow these steps:

#### Option 1: Use the secure runner scripts (Recommended)
```bash
# Windows Batch
run-backend.bat

# Windows PowerShell
.\run-backend.ps1
```

#### Option 2: Manual environment setup
```powershell
# Set environment variables first
$env:DATABASE_URL = "jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true"
$env:DATABASE_USERNAME = "avnadmin"
$env:DATABASE_PASSWORD = "AVNS_nILG52yp8jnwCZj-xYU"

# Then run the backend
cd Backend
mvn spring-boot:run
```

#### Option 3: Use .env file (Local development)
Create a `.env` file in the root directory:
```
DATABASE_URL=jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true
DATABASE_USERNAME=avnadmin
DATABASE_PASSWORD=AVNS_nILG52yp8jnwCZj-xYU
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## 🔒 Security Notes

- Database credentials are **never** stored in code
- `.env` files are ignored by Git (see `.gitignore`)
- Use environment variables in production deployments
- The `application.properties` file contains only variable references

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2.4 with MySQL (Aiven Cloud)
- **Frontend**: React with Vite
- **Database**: MySQL 8.0 on Aiven Cloud
- **Security**: Spring Security with JWT

## 📡 API Endpoints

- Health Check: `GET /api/health`
- Base URL: `http://localhost:8080`

## 🚀 Deployment

See `DEPLOYMENT.md` for production deployment instructions.