package com.arenax.repository;

import com.arenax.entity.ChatMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByMatch_IdOrderBySentAtAsc(Long matchId);
}

