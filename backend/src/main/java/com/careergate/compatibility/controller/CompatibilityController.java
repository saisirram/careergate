package com.careergate.compatibility.controller;

import com.careergate.common.response.ApiResponse;
import com.careergate.compatibility.service.CompatibilityService;
import com.careergate.entities.CompatibilityResult;
import com.careergate.entities.SkillGap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class CompatibilityController {

    private final CompatibilityService compatibilityService;

    public CompatibilityController(CompatibilityService compatibilityService) {
        this.compatibilityService = compatibilityService;
    }

    @PostMapping("/jobs/{jobId}/compatibility")
    public ResponseEntity<ApiResponse<CompatibilityResult>> calculateCompatibility(Principal principal,
            @PathVariable UUID jobId) {
        CompatibilityResult result = compatibilityService.calculateCompatibility(principal.getName(), jobId);
        return ResponseEntity.ok(ApiResponse.success(result, "Compatibility calculated successfully"));
    }

    @GetMapping("/compatibility/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCompatibilityResult(@PathVariable UUID id) {
        CompatibilityResult result = compatibilityService.getResult(id);
        List<SkillGap> gaps = compatibilityService.getGaps(id);

        return ResponseEntity.ok(ApiResponse.success(
                Map.of("result", result, "gaps", gaps),
                "Compatibility result fetched successfully"));
    }
}
