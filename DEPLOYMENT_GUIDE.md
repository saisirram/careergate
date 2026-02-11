# CareerGate - Free Deployment Guide

This guide provides step-by-step instructions to deploy the CareerGate application using **100% free** hosting services.

---

## Deployment Architecture Overview

```
Frontend (React) → Vercel/Netlify (Free)
Backend (Spring Boot) → Render/Railway (Free Tier)
Database (PostgreSQL) → Neon/Supabase (Free Tier)
Object Storage (MinIO) → Self-hosted on Render OR use Cloudflare R2 (Free 10GB)
```

---

## Option 1: Recommended Free Stack (Best Performance)

### **Frontend: Vercel**
- **Cost**: Free forever
- **Features**: Automatic deployments, CDN, SSL, unlimited bandwidth
- **Limits**: 100GB bandwidth/month (more than enough)

### **Backend: Render**
- **Cost**: Free tier available
- **Features**: Auto-deploy from GitHub, SSL, health checks
- **Limits**: 750 hours/month, sleeps after 15 min inactivity

### **Database: Neon (Serverless PostgreSQL)**
- **Cost**: Free tier
- **Features**: Serverless, auto-scaling, 0.5GB storage
- **Limits**: 3GB data transfer/month

### **Object Storage: Cloudflare R2**
- **Cost**: Free tier
- **Features**: S3-compatible, 10GB storage, 10M requests/month
- **Limits**: 10GB storage

---

## Step-by-Step Deployment

### **Step 1: Prepare Your Code**

#### 1.1 Create GitHub Repository
```bash
cd "d:\Coding Shuttle\Hackathon\version1"
git init
git add .
git commit -m "Initial commit - CareerGate v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/careergate.git
git push -u origin main
```

#### 1.2 Add Environment Variables Template
Create `backend/.env.example`:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://YOUR_NEON_HOST:5432/careergate
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_AI_OPENAI_API_KEY=sk-your-openai-key
MINIO_ENDPOINT=https://your-r2-endpoint.r2.cloudflarestorage.com
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
JWT_SECRET=your-256-bit-secret-key
```

---

### **Step 2: Deploy Database (Neon)**

1. **Sign up**: Go to [neon.tech](https://neon.tech) and create a free account
2. **Create Project**: Click "Create Project"
   - Name: `careergate-db`
   - Region: Choose closest to your users
3. **Get Connection String**: Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb
   ```
4. **Enable pgvector** (for future RAG features):
   - Go to SQL Editor
   - Run: `CREATE EXTENSION IF NOT EXISTS vector;`

---

### **Step 3: Deploy Backend (Render)**

#### 3.1 Prepare Backend for Production

Create `backend/Dockerfile`:
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: careergate-api
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/*.jar
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: SPRING_DATASOURCE_URL
        sync: false
      - key: SPRING_DATASOURCE_USERNAME
        sync: false
      - key: SPRING_DATASOURCE_PASSWORD
        sync: false
      - key: SPRING_AI_OPENAI_API_KEY
        sync: false
      - key: JWT_SECRET
        generateValue: true
    healthCheckPath: /actuator/health
```

#### 3.2 Deploy to Render

1. **Sign up**: Go to [render.com](https://render.com)
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect GitHub**: Authorize Render to access your repo
4. **Configure**:
   - Name: `careergate-api`
   - Root Directory: `backend`
   - Environment: `Docker`
   - Instance Type: `Free`
5. **Add Environment Variables**: Add all variables from `.env.example`
6. **Deploy**: Click "Create Web Service"

**Your API will be live at**: `https://careergate-api.onrender.com`

---

### **Step 4: Deploy Frontend (Vercel)**

#### 4.1 Update API Endpoint

Edit `frontend/src/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://careergate-api.onrender.com/api/v1';
```

Create `frontend/.env.production`:
```
VITE_API_URL=https://careergate-api.onrender.com/api/v1
```

#### 4.2 Deploy to Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com)
2. **Import Project**: Click "Add New..." → "Project"
3. **Import from GitHub**: Select your `careergate` repo
4. **Configure**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables**: Add `VITE_API_URL`
6. **Deploy**: Click "Deploy"

**Your app will be live at**: `https://careergate.vercel.app`

---

### **Step 5: Setup Object Storage (Cloudflare R2)**

#### 5.1 Create R2 Bucket

1. **Sign up**: Go to [cloudflare.com](https://cloudflare.com)
2. **Navigate to R2**: Dashboard → R2 Object Storage
3. **Create Bucket**: 
   - Name: `careergate-resumes`
   - Location: Automatic
4. **Get Credentials**:
   - Go to "Manage R2 API Tokens"
   - Create API Token with "Object Read & Write" permissions
   - Copy Access Key ID and Secret Access Key

#### 5.2 Update Backend Configuration

Add to Render environment variables:
```
MINIO_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
MINIO_ACCESS_KEY=<your-access-key>
MINIO_SECRET_KEY=<your-secret-key>
MINIO_BUCKET_NAME=careergate-resumes
```

---

## Alternative Free Options

### **Option 2: Railway (Alternative to Render)**
- **Pros**: $5 free credit monthly, faster cold starts
- **Cons**: Credit expires, need credit card for verification
- **Deploy**: Connect GitHub → Deploy → Add environment variables

### **Option 3: Fly.io (Alternative Backend)**
- **Pros**: 3 shared VMs free, persistent storage
- **Cons**: Requires Dockerfile, credit card verification
- **Deploy**: `fly launch` → Configure → `fly deploy`

### **Option 4: Supabase (Alternative Database)**
- **Pros**: PostgreSQL + Auth + Storage in one, 500MB free
- **Cons**: Pauses after 7 days inactivity
- **Setup**: Create project → Get connection string → Enable pgvector

---

## Production Checklist

### Backend (`application-prod.properties`)
```properties
# Database
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Flyway
spring.flyway.enabled=true

# Security
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# AI
spring.ai.openai.api-key=${SPRING_AI_OPENAI_API_KEY}

# CORS
cors.allowed-origins=https://careergate.vercel.app

# MinIO
minio.endpoint=${MINIO_ENDPOINT}
minio.access-key=${MINIO_ACCESS_KEY}
minio.secret-key=${MINIO_SECRET_KEY}
```

### Frontend CORS Configuration
Update `backend/src/main/java/com/careergate/config/SecurityConfig.java`:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "https://careergate.vercel.app",
        "http://localhost:5173" // For local development
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Paid Upgrade |
|---------|-----------|--------------|
| Vercel (Frontend) | ✅ Free Forever | $20/month (Pro) |
| Render (Backend) | ✅ Free (750hrs) | $7/month (Starter) |
| Neon (Database) | ✅ Free (0.5GB) | $19/month (Pro) |
| Cloudflare R2 (Storage) | ✅ Free (10GB) | $0.015/GB after |
| OpenAI API | Pay-as-you-go | ~$5-10/month for moderate use |
| **Total** | **~$5-10/month** | **~$50/month** |

---

## Monitoring & Maintenance

### Free Monitoring Tools
1. **Render Dashboard**: View logs, metrics, deployments
2. **Vercel Analytics**: Page views, performance
3. **Neon Console**: Database size, queries
4. **UptimeRobot**: Free uptime monitoring (50 monitors)

### Keep Free Tier Active
- **Render**: Make a request every 14 minutes to prevent sleep
  - Use cron-job.org to ping your API health endpoint
- **Neon**: Database auto-scales to zero when inactive (no action needed)

---

## Troubleshooting

### Backend Sleeps on Render
**Problem**: First request takes 30+ seconds
**Solution**: 
1. Use UptimeRobot to ping every 14 minutes
2. Upgrade to Render Starter ($7/month) for always-on

### CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
1. Check `cors.allowed-origins` in `application-prod.properties`
2. Verify Vercel deployment URL matches CORS config

### Database Connection Fails
**Problem**: "Connection refused" or "SSL required"
**Solution**: 
1. Add `?sslmode=require` to Neon connection string
2. Check Neon dashboard for correct connection string

---

## Next Steps: Custom Domain (Optional)

### Frontend Custom Domain (Free with Vercel)
1. Buy domain from Namecheap (~$10/year)
2. Add to Vercel: Settings → Domains → Add
3. Update DNS records as instructed

### Backend Custom Domain (Requires Paid Plan)
- Render: $7/month for custom domain support
- Alternative: Use Cloudflare Workers for free reverse proxy

---

**Congratulations!** 🎉 Your CareerGate application is now live and accessible worldwide for **FREE**!

**Live URLs**:
- Frontend: `https://careergate.vercel.app`
- Backend API: `https://careergate-api.onrender.com`
- API Docs: `https://careergate-api.onrender.com/swagger-ui.html`
