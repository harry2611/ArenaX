package com.arenax.service;

import com.arenax.dto.chat.ChatDtos;
import com.arenax.entity.ChatMessage;
import com.arenax.entity.Match;
import com.arenax.entity.Player;
import com.arenax.repository.ChatMessageRepository;
import com.arenax.repository.MatchRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final MatchRepository matchRepository;
    private final RealtimeService realtimeService;

    @Transactional(readOnly = true)
    public List<ChatDtos.ChatMessageResponse> getMessages(Long matchId) {
        return chatMessageRepository.findByMatch_IdOrderBySentAtAsc(matchId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ChatDtos.ChatMessageResponse sendMessage(
            Player player,
            Long matchId,
            ChatDtos.CreateMessageRequest request
    ) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        ChatMessage chatMessage = chatMessageRepository.save(ChatMessage.builder()
                .match(match)
                .sender(player)
                .content(request.content())
                .sentAt(LocalDateTime.now())
                .build());

        ChatDtos.ChatMessageResponse response = toResponse(chatMessage);
        realtimeService.broadcastChatMessage(matchId, response);
        return response;
    }

    private ChatDtos.ChatMessageResponse toResponse(ChatMessage chatMessage) {
        return new ChatDtos.ChatMessageResponse(
                chatMessage.getId(),
                chatMessage.getMatch().getId(),
                chatMessage.getSender().getId(),
                chatMessage.getSender().getDisplayName(),
                chatMessage.getContent(),
                chatMessage.getSentAt()
        );
    }
}

