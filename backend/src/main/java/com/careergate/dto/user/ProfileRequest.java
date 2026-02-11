package com.careergate.dto.user;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProfileRequest {
    @DecimalMin("0.0")
    private BigDecimal totalExperience;

    @DecimalMin("1.0")
    private BigDecimal currentCtc;

    @DecimalMin("1.0")
    private BigDecimal expectedCtc;

    @Min(0)
    @Max(120)
    private Integer noticePeriodDays;
}
