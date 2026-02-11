package com.careergate.dashboard.service;

import com.careergate.dashboard.dto.CandidateStats;
import com.careergate.dashboard.dto.RecruiterStats;
import com.careergate.entities.Job;
import com.careergate.entities.User;
import com.careergate.repositories.CompatibilityResultRepository;
import com.careergate.repositories.JobRepository;
import com.careergate.repositories.LearningRoadmapRepository;
import com.careergate.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final CompatibilityResultRepository compatibilityRepository;
    private final LearningRoadmapRepository roadmapRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public DashboardService(CompatibilityResultRepository compatibilityRepository,
            LearningRoadmapRepository roadmapRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {
        this.compatibilityRepository = compatibilityRepository;
        this.roadmapRepository = roadmapRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public CandidateStats getCandidateStats(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        UUID userId = user.getId();

        Double avgCompatibility = compatibilityRepository.findAverageCompatibilityScoreByUserId(userId);
        Double avgSkillScore = compatibilityRepository.findAverageSkillMatchScoreByUserId(userId);
        Long activeRoadmaps = (long) roadmapRepository.findByUserId(userId).size();
        Long jobsApplied = compatibilityRepository.countDistinctJobIdByUserId(userId);

        return CandidateStats.builder()
                .compatibility(avgCompatibility != null ? Math.round(avgCompatibility * 10.0) / 10.0 : 0.0)
                .skillScore(avgSkillScore != null ? Math.round(avgSkillScore * 10.0) / 10.0 : 0.0)
                .activeRoadmaps(activeRoadmaps)
                .jobsApplied(jobsApplied)
                .build();
    }

    public RecruiterStats getRecruiterStats(String email) {
        User recruiter = userRepository.findByEmail(email).orElseThrow();
        UUID recruiterId = recruiter.getId();

        List<Job> jobs = jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterId);
        List<UUID> jobIds = jobs.stream().map(Job::getId).collect(Collectors.toList());

        if (jobIds.isEmpty()) {
            return RecruiterStats.builder()
                    .jobsPosted(0L)
                    .totalApplicants(0L)
                    .avgSkillScore(0.0)
                    .topMatches(0L)
                    .build();
        }

        Long totalApplicants = compatibilityRepository.countDistinctUserIdByJobIdIn(jobIds);
        Double avgSkillScore = compatibilityRepository.findAverageSkillMatchScoreByJobIdIn(jobIds);
        Long topMatches = compatibilityRepository.countByJobIdInAndCompatibilityScoreGreaterThanEqual(jobIds, 80);

        return RecruiterStats.builder()
                .jobsPosted((long) jobs.size())
                .totalApplicants(totalApplicants)
                .avgSkillScore(avgSkillScore != null ? Math.round(avgSkillScore * 10.0) / 10.0 : 0.0)
                .topMatches(topMatches)
                .build();
    }
}
