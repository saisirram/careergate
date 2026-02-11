package com.careergate.dashboard.controller;

import com.careergate.common.response.ApiResponse;
import com.careergate.dashboard.dto.CandidateStats;
import com.careergate.dashboard.dto.RecruiterStats;
import com.careergate.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/candidate/stats")
    public ResponseEntity<ApiResponse<CandidateStats>> getCandidateStats(Principal principal) {
        CandidateStats stats = dashboardService.getCandidateStats(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(stats, "Candidate stats fetched successfully"));
    }

    @GetMapping("/recruiter/stats")
    public ResponseEntity<ApiResponse<RecruiterStats>> getRecruiterStats(Principal principal) {
        RecruiterStats stats = dashboardService.getRecruiterStats(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(stats, "Recruiter stats fetched successfully"));
    }
}
