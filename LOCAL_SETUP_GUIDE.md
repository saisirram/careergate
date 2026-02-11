# 🚀 CareerGate - Local Setup & Startup Guide

Welcome to **CareerGate**! This guide will help you set up the entire AI-driven hiring platform on your local machine for development and testing.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

*   **Java 21 JDK** (e.g., Eclipse Temurin or Oracle)
*   **Node.js** (v18 or higher) & **npm**
*   **PostgreSQL** (v14 or higher) with **pgvector** extension (optional but recommended for AI search)
*   **Docker Desktop** (easiest way to run Database and Storage)
*   **Maven** (for backend building)
*   **Git**

---

## 🏗️ Architecture Overview

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
*   **Backend**: Spring Boot 3.x, Spring AI, Spring Security (JWT)
*   **Database**: PostgreSQL
*   **Storage**: MinIO (S3-compatible local object storage)
*   **AI**: OpenRouter (accessing GPT-4o, Claude 3.5, etc.)

---

## 🏁 Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone https://github.com/saisirram/careergate.git
cd careergate
```

### 2. Database Setup (PostgreSQL)

You can run PostgreSQL using Docker (simplest) or install it directly.

**Using Docker:**
```bash
docker run --name careergate-db -e POSTGRES_PASSWORD=password -p 9020:5432 -d postgres:latest
```
*Note: The application is configured to look for the DB at port `9020` by default. You can change this in `application.properties`.*

**Manual Setup:**
1. Create a database named `career-gate-db`.
2. Ensure you have a user with credentials: `user` / `password`.
3. Update `backend/src/main/resources/application.properties` if your ports or credentials differ.

### 3. Object Storage Setup (MinIO)

CareerGate uses MinIO for local resume storage.

**Run via Docker:**
```bash
docker run -p 9000:9000 -p 9001:9001 --name careergate-minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  quay.io/minio/minio server /data --console-address ":9001"
```

**Configuration:**
1. Open MinIO Console: [http://localhost:9001](http://localhost:9001)
2. Login with `minioadmin` / `minioadmin123`.
3. Create a bucket named **`resumes`**.
4. Set the bucket access policy to **Public** (or use the default settings for local dev).

### 4. AI API Keys (OpenRouter)

1. Go to [OpenRouter.ai](https://openrouter.ai/keys) and create an account.
2. Generate an **API Key**.
3. **MANDATORY**: Go to [OpenRouter Privacy Settings](https://openrouter.ai/settings/privacy) and enable **"Allow data logging"** if you plan to use `:free` models.
4. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.ai.openai.api-key=YOUR_OPENROUTER_KEY
   ```

---

## 🚀 Running the Application

### Backend (Spring Boot)
1. Open a terminal in the `backend` directory.
2. Run the application:
```bash
./mvnw spring-boot:run
```
*The API will be available at [http://localhost:8080](http://localhost:8080)*
*Swagger UI (API Docs): [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)*

### Frontend (React + Vite)
1. Open a terminal in the `frontend` directory.
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
*The frontend will be available at [http://localhost:5173](http://localhost:5173)*

---

## 🔑 Default Credentials

If you haven't added custom data yet, you'll need to register a new account on the UI.

*   **Role: Recruiter** - For posting jobs and viewing candidates.
*   **Role: Candidate** - For uploading resumes and seeing roadmaps.

---

## 🧪 Testing the Flow

1. **Login as Recruiter**: Create a job posting (e.g., "Senior Java Developer").
2. **Login as Candidate**: 
   *   Upload your resume (PDF or DOCX).
   *   Go to "Find Jobs".
   *   Click "Check Compatibility" for the Java job.
   *   View your **AI-generated Roadmap** to see how to bridge your skill gaps.

---

## 🔧 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **DB Connection Refused** | Check if Docker container is running or port `9020` is correct. |
| **"User not found" (AI Error)** | Your OpenRouter key is wrong or "Data Logging" is disabled. |
| **Resume Upload Fails** | Ensure the MinIO bucket `resumes` exists. |
| **CORS Errors** | Check `CORS_ALLOWED_ORIGINS` in `application.properties`. |

---

## 📡 Useful Commands

*   **Force DB Migration**: `mvn flyway:migrate`
*   **Clean Build**: `mvn clean install -DskipTests`
*   **MinIO Shell (mc)**: Useful for managing buckets via CLI.

---

**Happy Coding!** If you encounter any issues, refer to the `ENTERPRISE_DESIGN_DOC.md` for deeper architecture details.
