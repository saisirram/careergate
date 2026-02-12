# 🚀 CareerGate - Job Compatibility & Skill Gap Analysis Platform

**Bridging the distance between ambition and achievement with AI-driven insights.**

CareerGate is a next-generation Career Intelligence platform designed to solve the "Black Hole" effect in job applications. By leveraging Large Language Models (LLMs) and Vector-based skill mapping, CareerGate provides candidates with instant, actionable feedback on their job compatibility and a personalized roadmap to success.

---

## 🌍 Live Demo
**Application URL:** [https://careergate.vercel.app/](https://careergate.vercel.app/)

> ### **⚠️⚠️⚠️ Important Notes**
> *   **Cold Start (Render Free Tier)**: The backend is hosted on Render's free instances, which sleep after inactivity. **The first request (e.g., login or profile loading) may take 60-90 seconds to wake up the server.** Please be patient during the initial load.
> *   **Database Wake-up**: The PostgreSQL database (Neon) also enters standby mode. If data doesn't appear immediately, wait a few seconds and refresh.
> *   **AI Processing**: Resume analysis and roadmap generation involve complex LLM orchestration — these might take a few moments to generate high-quality results.

---

## 🌐 Infrastructure & Deployment

The application is distributed across the following cloud platforms:

| Component | Platform | Description |
| :--- | :--- | :--- |
| **Frontend (UI)** | [Vercel](https://vercel.com/) | High-performance edge hosting for the React application. |
| **Backend (API)** | [Render](https://render.com/) | Dockerized Spring Boot service with automated CI/CD. |
| **Database** | [Neon](https://neon.tech/) | Serverless PostgreSQL for reliable data persistence. |
| **Object Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) | S3-compatible storage for secure resume management. |
| **AI Orchestration** | [OpenRouter](https://openrouter.ai/) | Unified API for access to various LLMs (Nemotron/GPT). |

---

## 📚 Documentation & Guides

To dive deeper into the project, please refer to the following documents:

| Document | Description |
| :--- | :--- |
| 📘 **[Design Document (V1.0)](./CareerGate%20Design%20Document%20V1.md)** | Detailed architecture, feature specifications, and system design. |
| 🛠️ **[Local Setup Guide](./LOCAL_SETUP_GUIDE.md)** | Step-by-step instructions to run CareerGate on your local machine. |

---

## 🚀 Key Features

### 🎯 For Candidates
*   **Precision Resume Analysis**: AI-powered parsing that understands semantic context, not just keywords.
*   **Weighted Compatibility Scoring**: A 0-100 score based on skill match, experience depth, and resume quality.
*   **Interactive Skill Gap Analysis**: Visual breakdown of your "Actual" vs. "Required" skills with suggestions for improvement.
*   **AI-Generated Learning Roadmaps**: Personalized, time-bound study plans featuring verified YouTube tutorials and technical documentation.
*   **One-Click Applications**: Seamlessly apply for jobs with automatic background compatibility checks.

### 💼 For Recruiters
*   **Intelligent Screening**: Instantly filter hundreds of resumes using AI-generated compatibility scores.
*   **Granular Job Settings**: Define minimum rating requirements for specific skills.
*   **Applicant Dashboard**: Track all applicants with rich insights into their strengths and areas for growth.

---



## 🛠️ Tech Stack

### Backend
*   **Java 21 & Spring Boot 3.2.2**: Enterprise-grade performance and scalability.
*   **Spring AI**: Seamless integration with LLMs (OpenAI/OpenRouter).
*   **Spring Security & JWT**: Secure, stateless authentication with Role-Based Access Control (RBAC).
*   **PostgreSQL**: Reliable relational data storage (hosted on Neon).
*   **Cloudflare R2 / MinIO**: S3-compatible object storage for secure resume management.
*   **Apache Tika**: Robust text extraction from PDF and DOCX formats.

### Frontend
*   **React 18 & TypeScript**: Modern, type-safe UI components.
*   **Tailwind CSS**: Utility-first styling for a clean, futuristic interface.
*   **Framer Motion**: Premium micro-animations and smooth transitions.
*   **Lucide React**: Beautiful, consistent iconography.
*   **React Query**: Efficient server-state management.

---

**Built with ❤️ for the future of hiring.**
