package com.arenax.controller;

import com.arenax.dto.ProfileResponse;
import com.arenax.security.ArenaUserPrincipal;
import com.arenax.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping("/me")
    public ProfileResponse getMe(@AuthenticationPrincipal ArenaUserPrincipal principal) {
        return playerService.getProfile(principal.player());
    }
}

