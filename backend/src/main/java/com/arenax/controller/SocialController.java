package com.arenax.controller;

import com.arenax.dto.social.SocialDtos;
import com.arenax.security.ArenaUserPrincipal;
import com.arenax.service.SocialService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;

    @GetMapping("/friends")
    public List<SocialDtos.FriendResponse> getFriends(@AuthenticationPrincipal ArenaUserPrincipal principal) {
        return socialService.getFriends(principal.player());
    }

    @PostMapping("/friends/request")
    public void sendFriendRequest(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @Valid @RequestBody SocialDtos.SendFriendRequest request
    ) {
        socialService.sendFriendRequest(principal.player(), request);
    }

    @PostMapping("/friends/{friendshipId}/accept")
    public void acceptFriendRequest(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @PathVariable Long friendshipId
    ) {
        socialService.acceptFriendRequest(principal.player(), friendshipId);
    }
}

