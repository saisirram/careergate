package com.careergate.dto.job;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class JobCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String companyName;

    @DecimalMin("0.0")
    private BigDecimal minExperience;

    @DecimalMin("0.0")
    private BigDecimal maxExperience;

    private BigDecimal minCtc;
    private BigDecimal maxCtc;

    @NotEmpty
    private List<JobRequiredSkillRequest> requiredSkills;
}
