# Deployment Instructions for Render

## Prerequisites
- Aiven MySQL database instance
- Docker Runtime selected on Render

## Environment Variables (Required in Render)

Set these in your Render service environment variables:

```
DATABASE_URL=jdbc:mysql://mysql-3ee21df4-saibhargavdamarla-3733.i.aivencloud.com:21469/defaultdb?serverSslMode=REQUIRED&allowPublicKeyRetrieval=true&connectTimeout=30000&socketTimeout=30000

DATABASE_USERNAME=avnadmin

DATABASE_PASSWORD=<YOUR_AIVEN_PASSWORD>

PORT=8080
```

## Steps to Deploy

1. **Connect GitHub Repository**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Runtime**
   - Runtime: Select "Docker"
   - Docker file path: `Backend/Dockerfile`

3. **Set Environment Variables**
   - Go to "Environment" tab
   - Add all 4 variables from the section above
   - Save changes

4. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete
   - Check logs if deployment fails

## Troubleshooting

- **Status 1 while running**: Check that ALL environment variables are set
- **Connection refused**: Verify DATABASE_URL is correct
- **Build fails**: Ensure Docker runtime is selected (not "Node", "Python", etc.)

## Local Testing

Test locally before deploying:

### Option 1: Use Aiven Cloud (Recommended)
```bash
# Run this batch file to set Aiven environment variables
set-aiven-env.bat

# Then start the backend
cd Backend && mvn spring-boot:run
```

### Option 2: Use Local MySQL
```bash
# Run this batch file to set local environment variables
set-local-env.bat

# Then start the backend
cd Backend && mvn spring-boot:run
```

**Why the configuration changes:**
- `application.properties` uses `${VARIABLE:fallback}` syntax
- If environment variable is set → uses that value
- If not set → uses safe fallback (localhost for development)
- **Never hardcode secrets** in config files (security risk)

Server should start on port 8080: `http://localhost:8080`
