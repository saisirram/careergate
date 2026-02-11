package com.careergate.roadmap.service;

import com.careergate.entities.*;
import com.careergate.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final RoadmapItemRepository roadmapItemRepository;
    private final UserRepository userRepository;
    private final CompatibilityResultRepository compatibilityRepository;
    private final SkillGapRepository skillGapRepository;
    private final com.careergate.compatibility.service.AiService aiService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private final com.careergate.compatibility.service.YouTubeVideoService youTubeVideoService;

    public RoadmapService(LearningRoadmapRepository roadmapRepository,
            RoadmapItemRepository roadmapItemRepository,
            UserRepository userRepository,
            CompatibilityResultRepository compatibilityRepository,
            SkillGapRepository skillGapRepository,
            com.careergate.compatibility.service.AiService aiService,
            com.fasterxml.jackson.databind.ObjectMapper objectMapper,
            com.careergate.compatibility.service.YouTubeVideoService youTubeVideoService) {
        this.roadmapRepository = roadmapRepository;
        this.roadmapItemRepository = roadmapItemRepository;
        this.userRepository = userRepository;
        this.compatibilityRepository = compatibilityRepository;
        this.skillGapRepository = skillGapRepository;
        this.aiService = aiService;
        this.objectMapper = objectMapper;
        this.youTubeVideoService = youTubeVideoService;
    }

    @Transactional
    public LearningRoadmap generateRoadmap(String userEmail, UUID jobId) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        // Find latest compatibility result
        CompatibilityResult comp = compatibilityRepository
                .findFirstByUserIdAndJobIdOrderByEvaluatedAtDesc(user.getId(), jobId)
                .orElseThrow(() -> new RuntimeException("Calculate compatibility first"));

        List<SkillGap> gaps = skillGapRepository.findByCompatibilityId(comp.getId());

        LearningRoadmap roadmap = roadmapRepository.findFirstByUserIdAndJobIdOrderByCreatedAtDesc(user.getId(), jobId)
                .orElse(LearningRoadmap.builder().userId(user.getId()).jobId(jobId).build());

        LearningRoadmap savedRoadmap = roadmapRepository.save(roadmap);

        // Delete old items if re-generating
        roadmapItemRepository.deleteByRoadmapId(savedRoadmap.getId());

        // 2. Prepare AI Context
        String gapsJson = gaps.stream()
                .map(g -> g.getSkill().getName() + " (Gap Level: " + g.getGap() + ")")
                .collect(java.util.stream.Collectors.joining(", "));

        // 3. Call AI for Roadmap
        String aiRoadmapJson = aiService.generateRoadmap(comp.getAiAnalysisSummary(), gapsJson);

        try {
            com.careergate.roadmap.dto.AiRoadmapResponse roadmapData = objectMapper.readValue(aiRoadmapJson,
                    com.careergate.roadmap.dto.AiRoadmapResponse.class);

            for (com.careergate.roadmap.dto.AiRoadmapResponse.Week week : roadmapData.getWeeks()) {
                for (com.careergate.roadmap.dto.AiRoadmapResponse.Day day : week.getDays()) {
                    // Serialize article links to JSON string
                    String articleLinksJson = day.getArticleLinks() != null
                            ? objectMapper.writeValueAsString(day.getArticleLinks())
                            : "[]";

                    // Get verified YouTube video ID
                    // If AI provides a video ID, use it; otherwise, get one from our verified
                    // database
                    String videoId = day.getYoutubeVideoId();
                    if (videoId == null || videoId.trim().isEmpty() || videoId.length() != 11) {
                        // Fallback to verified video based on topic
                        videoId = youTubeVideoService.getVideoIdForTopic(day.getTitle());
                    }

                    roadmapItemRepository.save(RoadmapItem.builder()
                            .roadmap(savedRoadmap)
                            .weekNo(week.getWeekNo())
                            .dayNo(day.getDayNo())
                            .title(day.getTitle())
                            .description(day.getDescription())
                            .youtubeVideoId(videoId)
                            .youtubeSearchQuery(day.getYoutubeSearchQuery())
                            .articleLinks(articleLinksJson)
                            .build());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("AI Roadmap generation failed: " + e.getMessage());
        }

        return savedRoadmap;
    }

    private LearningRoadmap savedResultWorkaround(LearningRoadmap r) {
        return r;
    }

    public List<LearningRoadmap> getUserRoadmaps(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return roadmapRepository.findByUserId(user.getId());
    }

    public LearningRoadmap getRoadmap(UUID id) {
        return roadmapRepository.findById(id).orElseThrow();
    }

    public List<RoadmapItem> getItems(UUID roadmapId) {
        return roadmapItemRepository.findByRoadmapIdOrderByWeekNoAscDayNoAsc(roadmapId);
    }

    @Transactional
    public RoadmapItem markItemComplete(UUID itemId) {
        RoadmapItem item = roadmapItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Roadmap item not found"));
        item.setCompleted(true);
        return roadmapItemRepository.save(item);
    }
}
