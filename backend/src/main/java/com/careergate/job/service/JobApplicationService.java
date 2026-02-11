package com.careergate.job.service;

import com.careergate.entities.Job;
import com.careergate.entities.JobApplication;
import com.careergate.entities.User;
import com.careergate.repositories.JobApplicationRepository;
import com.careergate.repositories.JobRepository;
import com.careergate.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobApplication applyToJob(String email, UUID jobId) {
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already applied
        if (jobApplicationRepository.findByCandidateIdAndJobId(candidate.getId(), jobId).isPresent()) {
            throw new RuntimeException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .candidate(candidate)
                .job(job)
                .status(JobApplication.ApplicationStatus.APPLIED)
                .build();

        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getMyApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobApplicationRepository.findByCandidateIdOrderByAppliedAtDesc(user.getId());
    }

    public List<JobApplication> getApplicationsForJob(UUID jobId) {
        return jobApplicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public boolean hasApplied(String email, UUID jobId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return jobApplicationRepository.findByCandidateIdAndJobId(user.getId(), jobId).isPresent();
    }
}
