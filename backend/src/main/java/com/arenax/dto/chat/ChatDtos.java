package com.arenax.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public final class ChatDtos {

    private ChatDtos() {
    }

    public record CreateMessageRequest(@NotBlank @Size(max = 800) String content) {
    }

    public record ChatMessageResponse(
            Long id,
            Long matchId,
            Long senderId,
            String senderDisplayName,
            String content,
            LocalDateTime sentAt
    ) {
    }
}

