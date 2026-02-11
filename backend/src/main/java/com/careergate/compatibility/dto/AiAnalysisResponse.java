package com.careergate.compatibility.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiAnalysisResponse {
    private int compatibilityScore;
    private int skillMatchScore;
    private int experienceScore;
    private int resumeScore;
    private String analysisSummary;
    private List<AiSkillGap> skillGaps;

    @Data
    public static class AiSkillGap {
        private String skillName;
        private int gapLevel;
        private Integer requiredRating;
        private Integer userRating;
        private String improvementSuggestions;
    }
}
