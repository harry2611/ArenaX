package com.arenax.service;

import com.arenax.dto.chat.ChatDtos;
import com.arenax.dto.tournament.TournamentDtos;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RealtimeService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastLeaderboard(Long tournamentId, List<TournamentDtos.LeaderboardEntryResponse> leaderboard) {
        messagingTemplate.convertAndSend("/topic/tournaments/" + tournamentId + "/leaderboard", leaderboard);
    }

    public void broadcastChatMessage(Long matchId, ChatDtos.ChatMessageResponse message) {
        messagingTemplate.convertAndSend("/topic/matches/" + matchId + "/chat", message);
    }
}

