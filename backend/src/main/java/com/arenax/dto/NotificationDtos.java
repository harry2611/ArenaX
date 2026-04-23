package com.arenax.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public final class NotificationDtos {

    private NotificationDtos() {
    }

    public record DeviceRegistrationRequest(
            @NotBlank String token,
            @NotBlank String platform
    ) {
    }

    public record NotificationResponse(
            Long id,
            String title,
            String body,
            LocalDateTime createdAt
    ) {
    }
}

