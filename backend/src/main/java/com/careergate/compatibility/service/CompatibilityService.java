package com.careergate.compatibility.service;

import com.careergate.entities.*;
import com.careergate.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CompatibilityService {

    private final CompatibilityResultRepository compatibilityRepository;
    private final SkillGapRepository skillGapRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final JobRequiredSkillRepository jobRequiredSkillRepository;
    private final UserSkillRepository userSkillRepository;
    private final AiService aiService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public CompatibilityService(CompatibilityResultRepository compatibilityRepository,
            SkillGapRepository skillGapRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            UserProfileRepository profileRepository,
            SkillRepository skillRepository,
            JobRequiredSkillRepository jobRequiredSkillRepository,
            UserSkillRepository userSkillRepository,
            AiService aiService,
            com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.compatibilityRepository = compatibilityRepository;
        this.skillGapRepository = skillGapRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.jobRequiredSkillRepository = jobRequiredSkillRepository;
        this.userSkillRepository = userSkillRepository;
        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public CompatibilityResult calculateCompatibility(String userEmail, UUID jobId) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();
        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        if (profile == null || profile.getResumeText() == null) {
            throw new RuntimeException("Resume not uploaded or profile incomplete");
        }

        List<UserSkill> userSkills = userSkillRepository.findByUserId(user.getId());
        String userSkillsContext = userSkills.stream()
                .map(us -> us.getSkill().getName() + ":" + us.getRating())
                .collect(Collectors.joining(", "));

        List<JobRequiredSkill> jobRequiredSkills = jobRequiredSkillRepository.findByJobId(jobId);
        List<String> requiredSkillNames = jobRequiredSkills.stream()
                .map(rs -> rs.getSkill().getName())
                .collect(Collectors.toList());

        // 1. Call AI for analysis
        String aiResponseJson = aiService.analyzeResume(profile.getResumeText(), job.getDescription(),
                requiredSkillNames, userSkillsContext);

        try {
            com.careergate.compatibility.dto.AiAnalysisResponse aiData = objectMapper.readValue(aiResponseJson,
                    com.careergate.compatibility.dto.AiAnalysisResponse.class);

            CompatibilityResult result = CompatibilityResult.builder()
                    .userId(user.getId())
                    .jobId(jobId)
                    .compatibilityScore(aiData.getCompatibilityScore())
                    .skillMatchScore(aiData.getSkillMatchScore())
                    .experienceMatchScore(aiData.getExperienceScore())
                    .resumeMatchScore(aiData.getResumeScore())
                    .aiAnalysisSummary(aiData.getAnalysisSummary())
                    .build();

            CompatibilityResult savedResult = compatibilityRepository.save(result);

            List<SkillGap> gaps = new ArrayList<>();
            for (com.careergate.compatibility.dto.AiAnalysisResponse.AiSkillGap aiGap : aiData.getSkillGaps()) {
                // Fail-safe: only add if there is a real gap (user rating < required rating)
                if (aiGap.getUserRating() != null && aiGap.getRequiredRating() != null
                        && aiGap.getUserRating() >= aiGap.getRequiredRating()) {
                    continue;
                }

                Skill skill = skillRepository.findByNameIgnoreCase(aiGap.getSkillName())
                        .orElseGet(() -> skillRepository
                                .save(Skill.builder().name(aiGap.getSkillName().toUpperCase()).build()));

                gaps.add(SkillGap.builder()
                        .compatibility(savedResult)
                        .skill(skill)
                        .gap(aiGap.getGapLevel())
                        .requiredRating(aiGap.getRequiredRating())
                        .userRating(aiGap.getUserRating())
                        .improvementSuggestions(aiGap.getImprovementSuggestions())
                        .build());
            }

            skillGapRepository.saveAll(gaps);
            savedResult.setGaps(gaps);
            return savedResult;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("AI Analysis failed: " + e.getMessage());
        }
    }

    public CompatibilityResult getResult(UUID id) {
        return compatibilityRepository.findById(id).orElseThrow();
    }

    public List<SkillGap> getGaps(UUID compatibilityId) {
        return skillGapRepository.findByCompatibilityId(compatibilityId);
    }
}
