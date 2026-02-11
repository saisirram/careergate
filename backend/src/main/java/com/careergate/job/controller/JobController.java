package com.careergate.job.controller;

import com.careergate.common.response.ApiResponse;
import com.careergate.dto.job.JobCreateRequest;
import com.careergate.entities.Job;
import com.careergate.job.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, UUID>>> createJob(Principal principal,
            @Valid @RequestBody JobCreateRequest request) {
        UUID jobId = jobService.createJob(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(Map.of("jobId", jobId), "Job created successfully"));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<ApiResponse<List<Job>>> getRecruiterJobs(Principal principal) {
        List<Job> jobs = jobService.getRecruiterJobs(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(jobs, "Recruiter jobs fetched successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs, "Jobs fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable UUID id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(job, "Job details fetched successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(Principal principal, @PathVariable UUID id,
            @Valid @RequestBody JobCreateRequest request) {
        Job job = jobService.updateJob(id, principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(job, "Job updated successfully"));
    }
}
