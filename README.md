# CareerGate - Job Compatibility & Skill Gap Analysis Platform

**Your gateway to the right job.**

CareerGate helps candidates evaluate their readiness for job roles, identify skill gaps, and follow a personalized roadmap to confidently apply for jobs.

## 🚀 Features

- **Compatibility Score**: Get a 0-100 score based on skill match, resume keywords, and experience.
- **Skill Gap Analysis**: Detailed breakdown of required vs. actual ratings for each skill.
- **Learning Roadmap**: Personalized week-by-week learning plan generated for identified gaps.
- **Job Posting**: Recruiters can post detailed job descriptions with skill requirements.
- **Role-Based Access**: Separate flows for Candidates and Recruiters.

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2 (Java 21)
- **Database**: PostgreSQL with Flyway Migration
- **Security**: Spring Security + JWT
- **Resume Parsing**: Apache Tika
- **Documentation**: SpringDoc OpenAPI (Swagger)

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: React Query + Context/Redux
- **HTTP Client**: Axios

## 📂 Project Structure

```
├── backend/            # Spring Boot Application
│   ├── src/main/java/com/careergate
│   ├── src/main/resources
│   └── pom.xml
│
├── frontend/           # React Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Java 21+ and Maven
- Node.js 18+ and npm
- PostgreSQL running locally

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Configure database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/careergate
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 License
MIT
