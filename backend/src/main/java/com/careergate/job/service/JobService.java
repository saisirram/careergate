package com.careergate.job.service;

import com.careergate.dto.job.JobCreateRequest;
import com.careergate.dto.job.JobRequiredSkillRequest;
import com.careergate.entities.*;
import com.careergate.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final JobRequiredSkillRepository jobRequiredSkillRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository,
            SkillRepository skillRepository, JobRequiredSkillRepository jobRequiredSkillRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.jobRequiredSkillRepository = jobRequiredSkillRepository;
    }

    @Transactional
    public UUID createJob(String recruiterEmail, JobCreateRequest request) {
        User recruiter = userRepository.findByEmail(recruiterEmail).orElseThrow();

        Job job = Job.builder()
                .recruiter(recruiter)
                .title(request.getTitle())
                .companyName(request.getCompanyName())
                .description(request.getDescription())
                .minExperience(request.getMinExperience())
                .maxExperience(request.getMaxExperience())
                .minCtc(request.getMinCtc())
                .maxCtc(request.getMaxCtc())
                .build();

        Job savedJob = jobRepository.save(job);

        for (JobRequiredSkillRequest skillReq : request.getRequiredSkills()) {
            Skill skill = skillRepository.findByNameIgnoreCase(skillReq.getSkill())
                    .orElseGet(() -> skillRepository
                            .save(Skill.builder().name(skillReq.getSkill().toUpperCase()).build()));

            JobRequiredSkill jobRequiredSkill = JobRequiredSkill.builder()
                    .job(savedJob)
                    .skill(skill)
                    .minRating(skillReq.getMinRating())
                    .build();
            jobRequiredSkillRepository.save(jobRequiredSkill);
        }

        return savedJob.getId();
    }

    public List<Job> getRecruiterJobs(String email) {
        User recruiter = userRepository.findByEmail(email).orElseThrow();
        return jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId());
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Job getJobById(UUID id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        // Force initialization of lazy collections for the API response
        if (job.getRequiredSkills() != null) {
            job.getRequiredSkills().size();
        }
        if (job.getRecruiter() != null) {
            job.getRecruiter().getEmail();
        }
        return job;
    }

    @Transactional
    public Job updateJob(UUID jobId, String recruiterEmail, JobCreateRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User recruiter = userRepository.findByEmail(recruiterEmail).orElseThrow();
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setDescription(request.getDescription());
        job.setMinExperience(request.getMinExperience());
        job.setMaxExperience(request.getMaxExperience());
        job.setMinCtc(request.getMinCtc());
        job.setMaxCtc(request.getMaxCtc());

        // Update skills
        jobRequiredSkillRepository.deleteByJobId(jobId);
        jobRequiredSkillRepository.flush();
        job.getRequiredSkills().clear();

        for (JobRequiredSkillRequest skillReq : request.getRequiredSkills()) {
            Skill skill = skillRepository.findByNameIgnoreCase(skillReq.getSkill())
                    .orElseGet(() -> skillRepository
                            .save(Skill.builder().name(skillReq.getSkill().toUpperCase()).build()));

            JobRequiredSkill jobRequiredSkill = JobRequiredSkill.builder()
                    .job(job)
                    .skill(skill)
                    .minRating(skillReq.getMinRating())
                    .build();
            jobRequiredSkillRepository.save(jobRequiredSkill);
        }

        return jobRepository.save(job);
    }
}
