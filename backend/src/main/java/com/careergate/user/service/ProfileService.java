package com.careergate.user.service;

import com.careergate.dto.user.ProfileRequest;
import com.careergate.dto.user.ProfileResponse;
import com.careergate.dto.user.SkillRequest;
import com.careergate.entities.*;
import com.careergate.repositories.*;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final com.careergate.common.service.MinioService minioService;
    private final Tika tika = new Tika();

    public ProfileService(UserProfileRepository profileRepository, UserRepository userRepository,
            SkillRepository skillRepository, UserSkillRepository userSkillRepository,
            com.careergate.common.service.MinioService minioService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.minioService = minioService;
    }

    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElse(UserProfile.builder().user(user).build());

        List<UserSkill> userSkills = userSkillRepository.findByUserId(user.getId());

        return ProfileResponse.builder()
                .totalExperience(profile.getTotalExperience())
                .currentCtc(profile.getCurrentCtc())
                .expectedCtc(profile.getExpectedCtc())
                .noticePeriodDays(profile.getNoticePeriodDays())
                .resumeFilePath(profile.getResumeFilePath())
                .resumeUrl(minioService.getPresignedUrl(profile.getResumeFilePath()))
                .skills(userSkills.stream().map(us -> ProfileResponse.SkillResponse.builder()
                        .skill(us.getSkill().getName())
                        .rating(us.getRating())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public void updateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElse(UserProfile.builder().user(user).build());

        profile.setTotalExperience(request.getTotalExperience());
        profile.setCurrentCtc(request.getCurrentCtc());
        profile.setExpectedCtc(request.getExpectedCtc());
        profile.setNoticePeriodDays(request.getNoticePeriodDays());

        profileRepository.save(profile);
    }

    @Transactional
    public void updateSkills(String email, List<SkillRequest> requests) {
        User user = userRepository.findByEmail(email).orElseThrow();

        // Delete existing skills and flush to avoid unique constraint violations on
        // re-insertion
        userSkillRepository.deleteByUserId(user.getId());
        userSkillRepository.flush();

        // Filter duplicates by skill name (case-insensitive) to prevent multiple
        // insertions in the same transaction
        java.util.Map<String, SkillRequest> uniqueSkills = new java.util.LinkedHashMap<>();
        for (SkillRequest req : requests) {
            uniqueSkills.put(req.getSkill().toLowerCase(), req);
        }

        for (SkillRequest req : uniqueSkills.values()) {
            Skill skill = skillRepository.findByNameIgnoreCase(req.getSkill())
                    .orElseGet(() -> {
                        Skill newSkill = Skill.builder().name(req.getSkill().toUpperCase()).build();
                        return skillRepository.saveAndFlush(newSkill);
                    });

            UserSkill userSkill = UserSkill.builder()
                    .user(user)
                    .skill(skill)
                    .rating(req.getRating())
                    .build();
            userSkillRepository.save(userSkill);
        }
    }

    @Transactional
    public void uploadResume(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElse(UserProfile.builder().user(user).build());

        try {
            // 1. Parse text for AI analysis
            String content = tika.parseToString(file.getInputStream());
            profile.setResumeText(content);

            // 2. Upload to MinIO for storage
            String minioKey = minioService.uploadFile(file);
            profile.setResumeFilePath(minioKey);

            profileRepository.save(profile);
        } catch (TikaException e) {
            throw new RuntimeException("Failed to parse resume: " + e.getMessage());
        }
    }
}
