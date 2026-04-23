package com.arenax.controller;

import com.arenax.dto.chat.ChatDtos;
import com.arenax.security.ArenaUserPrincipal;
import com.arenax.service.ChatService;
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
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{matchId}/chat")
    public List<ChatDtos.ChatMessageResponse> getMatchChat(@PathVariable Long matchId) {
        return chatService.getMessages(matchId);
    }

    @PostMapping("/{matchId}/chat")
    public ChatDtos.ChatMessageResponse sendMatchMessage(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @PathVariable Long matchId,
            @Valid @RequestBody ChatDtos.CreateMessageRequest request
    ) {
        return chatService.sendMessage(principal.player(), matchId, request);
    }
}

