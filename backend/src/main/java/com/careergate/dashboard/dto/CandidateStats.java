package com.careergate.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateStats {
    private Double compatibility;
    private Long activeRoadmaps;
    private Double skillScore;
    private Long jobsApplied;
}
