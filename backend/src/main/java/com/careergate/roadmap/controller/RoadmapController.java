package com.careergate.roadmap.controller;

import com.careergate.common.response.ApiResponse;
import com.careergate.roadmap.service.RoadmapService;
import com.careergate.entities.LearningRoadmap;
import com.careergate.entities.RoadmapItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/generate/{jobId}")
    public ResponseEntity<ApiResponse<LearningRoadmap>> generateRoadmap(Principal principal, @PathVariable UUID jobId) {
        LearningRoadmap roadmap = roadmapService.generateRoadmap(principal.getName(), jobId);
        return ResponseEntity.ok(ApiResponse.success(roadmap, "Roadmap generated successfully"));
    }

    @GetMapping("/my-roadmaps")
    public ResponseEntity<ApiResponse<List<LearningRoadmap>>> getUserRoadmaps(Principal principal) {
        List<LearningRoadmap> roadmaps = roadmapService.getUserRoadmaps(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(roadmaps, "User roadmaps fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRoadmap(@PathVariable UUID id) {
        LearningRoadmap roadmap = roadmapService.getRoadmap(id);
        List<RoadmapItem> items = roadmapService.getItems(id);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("roadmap", roadmap, "items", items),
                "Roadmap fetched successfully"));
    }

    @PatchMapping("/items/{itemId}/complete")
    public ResponseEntity<ApiResponse<RoadmapItem>> markItemComplete(@PathVariable UUID itemId) {
        RoadmapItem item = roadmapService.markItemComplete(itemId);
        return ResponseEntity.ok(ApiResponse.success(item, "Item marked as complete"));
    }
}
