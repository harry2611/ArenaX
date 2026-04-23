package com.arenax.dto;

import com.arenax.dto.tournament.TournamentDtos;

public record ProfileResponse(
        Long id,
        String username,
        String email,
        String displayName,
        Integer rank,
        String preferredRole,
        String favoriteGame,
        Integer wins,
        Integer losses,
        Long friendsCount,
        TournamentDtos.TeamSummaryResponse activeTeam
) {
}

