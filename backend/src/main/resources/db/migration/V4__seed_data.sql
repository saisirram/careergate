-- Seed common skills
INSERT INTO skills (id, name) VALUES 
(uuid_generate_v4(), 'Java'),
(uuid_generate_v4(), 'Spring Boot'),
(uuid_generate_v4(), 'React'),
(uuid_generate_v4(), 'TypeScript'),
(uuid_generate_v4(), 'PostgreSQL'),
(uuid_generate_v4(), 'Docker'),
(uuid_generate_v4(), 'AWS'),
(uuid_generate_v4(), 'Python'),
(uuid_generate_v4(), 'System Design')
ON CONFLICT (name) DO NOTHING;

-- Create a default recruiter (Password is: password123)
-- BCrypt: $2a$10$p.E9Xn1L3z5D5.u7R8G6O.u7R8G6O.u7R8G6O.u7R8G6O.u7R8G6O
INSERT INTO users (id, email, password, role) VALUES 
('d5e8f1b2-c3d4-4e5f-a6b7-c8d9e0f1a2b3', 'recruiter@careergate.com', '$2a$10$ByI6z.6.wNf7vS.8iE7v7.YnK8iE7v7.YnK8iE7v7.YnK8iE7v7.YnK', 'RECRUITER')
ON CONFLICT (email) DO NOTHING;

-- Insert Job 1: Senior Java Developer
INSERT INTO jobs (id, recruiter_id, title, company_name, description, min_experience, max_experience, min_ctc, max_ctc) VALUES
('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'd5e8f1b2-c3d4-4e5f-a6b7-c8d9e0f1a2b3', 'Senior Java Developer', 'Tech Corp', 'We are looking for a Senior Java Developer with strong experience in Spring Boot and Microservices. You will be responsible for building scalable backend applications.', 5.0, 10.0, 1500000.00, 2500000.00)
ON CONFLICT (id) DO NOTHING;

-- Add required skills for Job 1
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', id, 4 FROM skills WHERE name = 'Java'
ON CONFLICT DO NOTHING;
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', id, 4 FROM skills WHERE name = 'Spring Boot'
ON CONFLICT DO NOTHING;
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', id, 3 FROM skills WHERE name = 'PostgreSQL'
ON CONFLICT DO NOTHING;

-- Insert Job 2: Frontend Engineer (React/TypeScript)
INSERT INTO jobs (id, recruiter_id, title, company_name, description, min_experience, max_experience, min_ctc, max_ctc) VALUES
('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'd5e8f1b2-c3d4-4e5f-a6b7-c8d9e0f1a2b3', 'Frontend Engineer', 'WebFlow Systems', 'Join our frontend team to build beautiful and responsive user interfaces using React and TypeScript. Experience with Framer Motion is a plus.', 2.0, 5.0, 1000000.00, 1800000.00)
ON CONFLICT (id) DO NOTHING;

-- Add required skills for Job 2
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', id, 4 FROM skills WHERE name = 'React'
ON CONFLICT DO NOTHING;
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', id, 3 FROM skills WHERE name = 'TypeScript'
ON CONFLICT DO NOTHING;

-- Insert Job 3: DevOps Specialist
INSERT INTO jobs (id, recruiter_id, title, company_name, description, min_experience, max_experience, min_ctc, max_ctc) VALUES
('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'd5e8f1b2-c3d4-4e5f-a6b7-c8d9e0f1a2b3', 'DevOps Specialist', 'CloudScale Inc', 'Manage our cloud infrastructure and CI/CD pipelines. Strong experience with Docker and AWS is required.', 3.0, 7.0, 1200000.00, 2200000.00)
ON CONFLICT (id) DO NOTHING;

-- Add required skills for Job 3
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', id, 4 FROM skills WHERE name = 'Docker'
ON CONFLICT DO NOTHING;
INSERT INTO job_required_skills (job_id, skill_id, min_rating)
SELECT 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', id, 4 FROM skills WHERE name = 'AWS'
ON CONFLICT DO NOTHING;
