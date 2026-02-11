package com.careergate.job.controller;

import com.careergate.common.response.ApiResponse;
import com.careergate.entities.JobApplication;
import com.careergate.job.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApiResponse<JobApplication>> applyToJob(Principal principal, @PathVariable UUID jobId) {
        JobApplication application = jobApplicationService.applyToJob(principal.getName(), jobId);
        return ResponseEntity.ok(ApiResponse.success(application, "Applied to job successfully"));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getMyApplications(Principal principal) {
        List<JobApplication> applications = jobApplicationService.getMyApplications(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(applications, "Applications fetched successfully"));
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<ApiResponse<Boolean>> hasApplied(Principal principal, @PathVariable UUID jobId) {
        boolean applied = jobApplicationService.hasApplied(principal.getName(), jobId);
        return ResponseEntity.ok(ApiResponse.success(applied, "Status fetched successfully"));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getApplicationsForJob(@PathVariable UUID jobId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsForJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(applications, "Applications for job fetched successfully"));
    }
}
