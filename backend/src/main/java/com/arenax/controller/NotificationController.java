package com.arenax.controller;

import com.arenax.dto.NotificationDtos;
import com.arenax.security.ArenaUserPrincipal;
import com.arenax.service.NotificationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationDtos.NotificationResponse> getNotifications(
            @AuthenticationPrincipal ArenaUserPrincipal principal
    ) {
        return notificationService.getNotifications(principal.player());
    }

    @PostMapping("/devices")
    public void registerDevice(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @Valid @RequestBody NotificationDtos.DeviceRegistrationRequest request
    ) {
        notificationService.registerDevice(principal.player(), request);
    }
}

