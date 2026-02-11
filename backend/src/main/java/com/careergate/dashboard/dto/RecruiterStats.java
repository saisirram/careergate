package com.careergate.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecruiterStats {
    private Long jobsPosted;
    private Long totalApplicants;
    private Double avgSkillScore;
    private Long topMatches;
}
