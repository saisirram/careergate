package com.careergate.dto.job;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobRequiredSkillRequest {
    @NotBlank
    private String skill;

    @Min(1)
    @Max(5)
    private Integer minRating;
}
