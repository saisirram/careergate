package com.careergate.dto.compatibility;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CompatibilityResponse {
    private UUID id;
    private Integer compatibilityScore;
    private Integer skillMatchScore;
    private Integer experienceMatchScore;
    private Integer resumeMatchScore;
    private String analysisSummary;
    private List<SkillGapResponse> skillGapAnalysis;
}

@Data
@Builder
class SkillGapResponse {
    private String skill;
    private Integer requiredRating;
    private Integer userRating;
    private Integer gap;
    private String recommendation;
}
