# CareerGate - Job Compatibility & Skill Gap Analysis Platform

|**Document Name:**|Design Document (DD)|
| - | - |
|**Version:**|V1.0|
|**Release Date:**|10 Feb 2026|
|**Author:**|Sai Sriram Vundavalli|

---

## 1. **Project Overview:**

CareerGate is a next-generation Career Intelligence platform designed to bridge the widening gap between industry requirements and candidate skills. By leveraging Large Language Models (LLMs) and Vector-based skill mapping, CareerGate automates the process of compatibility analysis, resume parsing, and personalized learning path generation.

---

## 2. **Problem Statement & Pain Points:**

### **2.1. The Candidate’s Challenge:**

- **The "Black Hole" Effect:** Candidates apply for jobs and never receive feedback on why they were rejected.
- **Skill Ambiguity:** Candidates often don't know exactly which skill they are missing for a specific role.
- **Fragmented Learning:** Even when a gap is identified, finding high-quality, relevant resources (videos/docs) is a time-consuming task.

### **2.2. The Recruiter’s Challenge:**

- **Resume Overload:** Recruiters receive hundreds of resumes per job post, often with 80% being irrelevant.
- **Surface-Level Keyword Matching:** Traditional ATS (Applicant Tracking Systems) rely on simple keyword matching, missing candidates with equivalent alternative skills.
- **Subjectivity:** Manual screening is prone to bias and inconsistent evaluation of skill proficiency.

---

## 3. **The CareerGate Solution:**

   CareerGate solves these problems by providing an AI-Driven Feedback Loop:

   **1. Semantic Analysis:** Goes beyond keywords to understand the context of experience using LLMs.

   **2. Quantified Compatibility:** Provides a weighted score (0-100) based on multiple vectors:

- **Skill Match:** Gap between required vs. possessed skills.
- **Experience Match:** Depth of years vs. seniority required.
- **Resume Quality:** Formatting, clarity, and relevance.

**3. Automated Upskilling:** Automatically generates a time-bound learning roadmap with verified resources for every identified gap.

---

## 4. **System Architecture:**

   The application follows a modern decoupled architecture with a React-based frontend and a Java Spring Boot backend, integrated with OpenAI via Spring AI.

![A screen shot of a computer&#x0A;&#x0A;Description automatically generated](system_architecture.png)

### **4.1. Component-Wise Design:**

   #### **4.1.1. Frontend (React)**

**Responsibilities**

- Authentication & role-based routing
- Resume upload & profile management
- Skill gap visualizations
- Learning roadmap tracking

**Key Screens:**

- Candidate Dashboard
- Job Compatibility View
- Skill Gap Radar Chart
- Learning Roadmap Timeline
- Recruiter Dashboard

#### **4.1.2. Backend Services**
   1. **User & Profile Service**
   - Manages users, roles, and candidate profiles
   - Stores parsed resume text
   - Maintains experience, CTC, notice period

#### **4.1.2.2 Job Management Service**

- Recruiters create & manage jobs
- Define required skills with minimum ratings
- Maintains job metadata

#### **4.1.2.3 Application Service**

- Handles job applications
- Links candidate ↔ job
- Tracks application status

#### **4.1.2.4 AI Compatibility Engine (Core)**

**Inputs**

- Resume text
- User skills
- Job description
- Job required skills

**Outputs**

- Compatibility score (0–100)
- Skill match score
- Experience match score
- AI-generated explanation

#### **4.1.2.5 Learning Roadmap Service**

- Converts **skill gaps → structured learning plan**
- Generates week/day-wise roadmap
- Uses verified learning resources

## 5. **Entity Relationship (ER) Diagram:**

   The database schema is designed to handle users, their modular skills, job requirements, and the complex results of AI analysis.

![A screenshot of a computer&#x0A;&#x0A;Description automatically generated](ER_Diagram.png)

---

## 6. Feature Specification

### 6.1 User Authentication & Role-Based Access Control (RBAC)
- **Description**: Secure JWT-based stateless authentication with three distinct user roles: ADMIN, RECRUITER, and CANDIDATE.
- **Technical Implementation**: Spring Security with custom JWT filter chain, BCrypt password hashing.
- **Example**: A recruiter can only view and manage their own job postings, while candidates can only apply for jobs and view their own compatibility results.

### 6.2 User Profile Management
- **Description**: Comprehensive profile management system allowing candidates to maintain their professional information.
- **Features**:
  - Resume upload and parsing (PDF/DOCX support via Apache Tika)
  - Self-reported skill ratings (1-5 scale)
  - Experience tracking (total years)
  - Compensation expectations (current CTC, expected CTC)
  - Notice period management
- **Example**: A candidate uploads their resume, and the system automatically extracts text for AI analysis while storing the original file in Minio S3 for future reference.

### 6.3 MinIO S3-Compatible Object Storage
- **Description**: Enterprise-grade distributed object storage for resume files and documents.
- **Technical Implementation**: 
  - MinIO server integration with Spring Boot
  - Automatic bucket creation and management
  - Secure file upload/download with presigned URLs
  - File metadata tracking in PostgreSQL
- **Benefits**:
  - Scalable storage independent of database
  - Cost-effective compared to cloud storage
  - Self-hosted data sovereignty
- **Example**: When a candidate uploads a 2MB PDF resume, it's stored in MinIO bucket `careergate-resumes` with a unique UUID filename, while the database stores only the reference path.

### 6.4 Job Posting & Management
- **Description**: Full-featured job posting system for recruiters with granular skill requirements.
- **Features**:
  - Rich text job descriptions
  - Multiple skill requirements with minimum rating thresholds
  - Experience range specification (min/max years)
  - Compensation range (min/max CTC)
  - Company name and location
  - Edit and delete capabilities
- **Technical Implementation**: 
  - Transactional job updates with orphan removal for skill changes
  - Unique constraint handling for job-skill combinations
  - Cascading deletes for data integrity
- **Example**: A recruiter posts a "Senior Java Developer" role requiring Java (min rating 4), Spring Boot (min rating 3), and Docker (min rating 2), with 5-8 years experience and 15-25 LPA compensation.

### 6.5 Interactive Dashboard (Candidate)
- **Description**: Personalized dashboard showing job compatibility scores, skill gaps, and learning progress.
- **Features**:
  - Job listing with real-time compatibility scores
  - Visual skill gap analysis with gauge charts
  - Learning roadmap progress tracking
  - Application status monitoring
- **UI/UX**: Glassmorphism design with Framer Motion animations, responsive layout, dark mode support.
- **Example**: A candidate sees their dashboard showing 85% compatibility with a job, with visual indicators for 3 skill gaps and a 2-week learning roadmap in progress.

### 6.6 Interactive Dashboard (Recruiter)
- **Description**: Recruiter-focused dashboard for managing job posts and viewing applicants.
- **Features**:
  - Job post management (create, edit, delete)
  - Applicant tracking with AI-generated compatibility scores
  - Bulk applicant filtering and sorting
  - Application status updates
- **Example**: A recruiter views 47 applications for a job, sorted by compatibility score (highest first), and can instantly see that the top candidate has a 92% match with only 1 minor skill gap.

### 6.7 Precision Resume Analysis
- **Description**: AI-powered resume parsing and semantic analysis using GPT-4o.
- **Technical Implementation**:
  - Apache Tika for text extraction from PDF/DOCX
  - Spring AI ChatClient with SimpleLoggerAdvisor for observability
  - Custom prompt engineering for structured JSON responses
- **Analysis Dimensions**:
  - Skill matching (weighted by rating requirements)
  - Experience alignment (years and relevance)
  - Resume quality (formatting, clarity, completeness)
- **Example**: If a job asks for "Cloud Infrastructure" and a resume lists "AWS EC2/S3" and "Terraform", the AI identifies a 95% match despite the different terminology, understanding that Terraform is an Infrastructure-as-Code tool relevant to cloud infrastructure.

### 6.8 Interactive Skill Gap Analysis
- **Description**: Visual dashboard showing the "Required" vs "Actual" rating for each skill with actionable improvement suggestions.
- **Features**:
  - Color-coded gap severity (green: no gap, yellow: minor, red: critical)
  - AI-generated improvement suggestions (2-3 lines per skill)
  - Gap level calculation (1-5 scale)
  - Filtering to show only skills where user rating < required rating
- **Example**: A job requires Java (Rating 4). A candidate has Java (Rating 2). The system identifies a "Gap of 2" and tags it as "Critical" with the suggestion: "Focus on advanced Java concepts like multithreading, JVM internals, and design patterns. Practice building production-grade applications."

### 6.9 AI-Generated Learning Roadmaps
- **Description**: Personalized, time-bound learning plans with curated resources.
- **Features**:
  - Week-by-week, day-by-day structured curriculum
  - Verified YouTube video IDs from top educational channels
  - Fallback YouTube search queries for niche topics
  - Official documentation links (MDN, Spring.io, etc.)
  - Progress tracking with completion checkboxes
  - Embedded video player with fallback search
- **Technical Implementation**:
  - Custom YouTube video verification service with 25+ pre-verified IDs
  - Fuzzy matching algorithm to distinguish Java vs JavaScript
  - JSON storage for article links array
- **Example**: For a "Docker" gap, the roadmap includes:
  - **Week 1, Day 1**: "Docker Architecture Fundamentals"
    - Video: `pTJxdL_pIWM` (Docker Tutorial - Programming with Mosh)
    - Search Query: "Docker tutorial complete guide Programming with Mosh"
    - Articles: [Docker Official Docs](https://docs.docker.com), [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### 6.10 Job Application Management
- **Description**: Streamlined application process with duplicate prevention and status tracking.
- **Features**:
  - One-click application submission
  - Duplicate application prevention (backend validation)
  - Application status indicators (Applied, Under Review, Rejected, Accepted)
  - Application history for candidates
  - Applicant list for recruiters with compatibility scores
- **Example**: A candidate clicks "Apply for Job" and the button immediately changes to "Applied Successfully" with a green checkmark, preventing accidental duplicate applications.

### 6.11 AI Observability & Logging
- **Description**: Full transparency into AI decision-making with request/response logging.
- **Technical Implementation**: Spring AI SimpleLoggerAdvisor integration
- **Benefits**:
  - Debug AI hallucinations or incorrect responses
  - Monitor token usage and costs
  - Audit trail for compliance
  - Prompt refinement based on actual outputs
- **Example**: Server logs show the exact prompt sent to GPT-4o for a compatibility analysis and the raw JSON response, allowing developers to identify if the AI is correctly following instructions.

---


## 7. **Tech Stack Details:**

   **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion (Animations), Lucide React (Icons).

**Backend:** Java 21, Spring Boot 3.2.2, Spring AI (1.0.0-M5), Spring Security.

**Database:** PostgreSQL (Relational storage and Vector support for potential embedding features).

**AI:** OpenAI Chat Completions for resume analysis and roadmap generation.

**External Storage:** Minio (Minio S3)

---

## 8. **User Flow:**

### **8.1. Candidate User Flow**

![A screenshot of a computer&#x0A;&#x0A;Description automatically generated](User_flow.png)



### **8.2. Recruiter Flow**

![A screenshot of a computer&#x0A;&#x0A;Description automatically generated](recruiter_flow.png)

---
