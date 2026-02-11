package com.careergate.user.controller;

import com.careergate.common.response.ApiResponse;
import com.careergate.dto.user.ProfileRequest;
import com.careergate.dto.user.ProfileResponse;
import com.careergate.dto.user.SkillRequest;
import com.careergate.user.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(Principal principal) {
        ProfileResponse profile = profileService.getProfile(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile fetched successfully"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<String>> updateProfile(Principal principal,
            @Valid @RequestBody ProfileRequest request) {
        profileService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(null, "Profile updated successfully"));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<String>> updateSkills(Principal principal,
            @Valid @RequestBody List<SkillRequest> requests) {
        profileService.updateSkills(principal.getName(), requests);
        return ResponseEntity.ok(ApiResponse.success(null, "Skills updated successfully"));
    }

    @PostMapping("/resume")
    public ResponseEntity<ApiResponse<String>> uploadResume(Principal principal,
            @RequestParam("file") MultipartFile file) throws IOException {
        profileService.uploadResume(principal.getName(), file);
        return ResponseEntity.ok(ApiResponse.success(null, "Resume uploaded and parsed successfully"));
    }
}
