-- Add company_name to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);

-- Add ai_analysis_summary to job_compatibility_result table if missing
ALTER TABLE job_compatibility_result ADD COLUMN IF NOT EXISTS ai_analysis_summary TEXT;

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_application UNIQUE (candidate_id, job_id)
);
