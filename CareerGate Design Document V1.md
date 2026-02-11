
|**Document Name:**|Design Document (DD)|
| - | - |
|**Version:**|V1.0|
|**Release Date:**|10 Feb 2026|
|**Author:**|Sai Sriram Vundavalli|

# 1. **Project Overview:**

CareerGate is a next-generation Career Intelligence platform designed to bridge the widening gap between industry requirements and candidate skills. By leveraging Large Language Models (LLMs) and Vector-based skill mapping, CareerGate automates the process of compatibility analysis, resume parsing, and personalized learning path generation.

# 2. **Problem Statement & Pain Points:**

## **2.1. The Candidate’s Challenge:**

- **The "Black Hole" Effect:** Candidates apply for jobs and never receive feedback on why they were rejected.
- **Skill Ambiguity:** Candidates often don't know exactly which skill they are missing for a specific role.
- **Fragmented Learning:** Even when a gap is identified, finding high-quality, relevant resources (videos/docs) is a time-consuming task.

**2.2. The Recruiter’s Challenge:**

- **Resume Overload:** Recruiters receive hundreds of resumes per job post, often with 80% being irrelevant.
- **Surface-Level Keyword Matching:** Traditional ATS (Applicant Tracking Systems) rely on simple keyword matching, missing candidates with equivalent alternative skills.
- **Subjectivity:** Manual screening is prone to bias and inconsistent evaluation of skill proficiency.

# 3. **The CareerGate Solution:**

   CareerGate solves these problems by providing an AI-Driven Feedback Loop:

   **1. Semantic Analysis:** Goes beyond keywords to understand the context of experience using LLMs.

   **2. Quantified Compatibility:** Provides a weighted score (0-100) based on multiple vectors:

- **Skill Match:** Gap between required vs. possessed skills.
- **Experience Match:** Depth of years vs. seniority required.
- **Resume Quality:** Formatting, clarity, and relevance.

**3. Automated Upskilling:** Automatically generates a time-bound learning roadmap with verified resources for every identified gap.


# 4. **Feature Specification:**

   ## **4.1 Precision Resume Analysis:**

   **Description:** Extracts entities (Skills, Experience, Education) and maps them to a normalized taxonomy.

   **Example:** If a job asks for "Cloud Infrastructure" and a resume lists "AWS EC2/S3" and "Terraform", the AI identifies a 95% match despite the different terminology.

   ## **4.2 Interactive Skill Gap Analysis:**

   **Description:** A visual dashboard showing the "Required" vs "Actual" rating for each skill.

   **Example:** A job requires Java (Rating 4). A candidate has Java (Rating 2). The system identifies a "Gap of 2" and tags it as "Critical".

   ## **4.3 AI-Generated Learning Roadmaps:**

   **Description:** A curated 1-4 week plan.

   **Example:** For a "Docker" gap, Day 1 includes a "Docker Architecture" video from Programming with Mosh and a link to the official Docker documentation.


# 5. **System Architecture:**

   The application follows a modern decoupled architecture with a React-based frontend and a Java Spring Boot backend, integrated with OpenAI via Spring AI.

![A screen shot of a computer&#x0A;&#x0A;Description automatically generated](system_architecture.png)

## **5.1. Component-Wise Design:**

   ### **5.1.1. Frontend (React)**

**Responsibilities**

- Authentication & role-based routing
- Resume upload & profile management
- Skill gap visualizations
- Learning roadmap tracking

**Key Screens:**

- Candidate Dashboard
- Job Compatibility View
- Skill Gap Radar Chart
- Learning Roadmap Timeline\
  Recruiter Dashboard

### **5.1.2. Backend Services**
   1. **User & Profile Service**
   - Manages users, roles, and candidate profiles
   - Stores parsed resume text
   - Maintains experience, CTC, notice period

### **5.1.2.2 Job Management Service**

- Recruiters create & manage jobs
- Define required skills with minimum ratings
- Maintains job metadata

### **5.1.2.3 Application Service**

- Handles job applications
- Links candidate ↔ job
- Tracks application status

**5.1.2.4 AI Compatibility Engine (Core)**

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

### **5.1.2.5 Learning Roadmap Service**

- Converts **skill gaps → structured learning plan**
- Generates week/day-wise roadmap
- Uses verified learning resources


# 6. **Tech Stack Details:**

   **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion (Animations), Lucide React (Icons).

**Backend:** Java 21, Spring Boot 3.2.2, Spring AI (1.0.0-M5), Spring Security.

**Database:** PostgreSQL (Relational storage and Vector support for potential embedding features).

**AI:** OpenAI Chat Completions for resume analysis and roadmap generation.

**External Storage:** Minio (Minio S3)


# 7. **Entity Relationship (ER) Diagram:**

   The database schema is designed to handle users, their modular skills, job requirements, and the complex results of AI analysis.

![A screenshot of a computer&#x0A;&#x0A;Description automatically generated](ER_Diagram.png)


# 8. **User Flow:**

## **8.1. Candidate User Flow**

![A screenshot of a computer&#x0A;&#x0A;Description automatically generated](User_flow.png)



## **8.2. Recruiter Flow**

![A screenshot of a computer&#x0A;&#x0A;Description automatically generated](recruiter_flow.png)


