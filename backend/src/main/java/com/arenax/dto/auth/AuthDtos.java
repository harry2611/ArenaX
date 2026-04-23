package com.arenax.dto.auth;

import com.arenax.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 8, max = 100) String password
    ) {
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 32) String username,
            @Email @NotBlank String email,
            @NotBlank @Size(min = 2, max = 60) String displayName,
            @NotBlank @Size(min = 8, max = 100) String password
    ) {
    }

    public record UserResponse(
            Long id,
            String username,
            String email,
            String displayName,
            Integer rank,
            String preferredRole,
            UserRole role
    ) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }
}

