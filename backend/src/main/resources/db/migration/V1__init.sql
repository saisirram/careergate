-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- USERS Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER_PROFILE Table
CREATE TABLE IF NOT EXISTS user_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_experience DECIMAL(4,1),
    current_ctc DECIMAL(10,2),
    expected_ctc DECIMAL(10,2),
    notice_period_days INT,
    resume_file_path TEXT,
    resume_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- SKILLS Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- USER_SKILLS Table
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

-- JOBS Table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    min_experience DECIMAL(4,1),
    max_experience DECIMAL(4,1),
    min_ctc DECIMAL(10,2),
    max_ctc DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JOB_REQUIRED_SKILLS Table
CREATE TABLE IF NOT EXISTS job_required_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    min_rating INT CHECK (min_rating BETWEEN 1 AND 5),
    CONSTRAINT unique_job_skill UNIQUE (job_id, skill_id)
);

-- JOB_COMPATIBILITY_RESULT Table
CREATE TABLE IF NOT EXISTS job_compatibility_result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    job_id UUID NOT NULL,
    compatibility_score INT,
    resume_match_score INT,
    skill_match_score INT,
    experience_match_score INT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SKILL_GAP_ANALYSIS Table
CREATE TABLE IF NOT EXISTS skill_gap_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    compatibility_id UUID NOT NULL REFERENCES job_compatibility_result(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_rating INT,
    user_rating INT,
    gap INT
);

-- LEARNING_ROADMAP Table
CREATE TABLE IF NOT EXISTS learning_roadmap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    job_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ROADMAP_ITEMS Table
CREATE TABLE IF NOT EXISTS roadmap_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES learning_roadmap(id) ON DELETE CASCADE,
    week_no INT NOT NULL,
    day_no INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_link TEXT
);
