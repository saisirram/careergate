package com.careergate.dto.auth;

import com.careergate.entities.Role;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UUID userId;
    private String email;
    private Role role;
}
