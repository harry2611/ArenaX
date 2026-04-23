package com.arenax.dto.tournament;

import com.arenax.enums.MatchStatus;
import com.arenax.enums.TournamentStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public final class TournamentDtos {

    private TournamentDtos() {
    }

    public record TournamentSummaryResponse(
            Long id,
            String name,
            String gameTitle,
            String format,
            TournamentStatus status,
            LocalDateTime startAt,
            LocalDateTime registrationClosesAt,
            Long registeredTeams,
            Integer maxTeams,
            String prizePool,
            String region,
            String heroTag
    ) {
    }

    public record TeamSummaryResponse(
            Long id,
            String name,
            String region,
            String captainName,
            Long memberCount,
            String inviteCode
    ) {
    }

    public record LeaderboardEntryResponse(
            Long id,
            Long teamId,
            String teamName,
            Integer points,
            Integer wins,
            Integer losses,
            String streak
    ) {
    }

    public record MatchResponse(
            Long id,
            String roundLabel,
            String teamAName,
            String teamBName,
            Integer teamAScore,
            Integer teamBScore,
            LocalDateTime scheduledAt,
            MatchStatus status,
            String winnerTeamName
    ) {
    }

    public record TournamentDetailResponse(
            Long id,
            String name,
            String gameTitle,
            String format,
            TournamentStatus status,
            LocalDateTime startAt,
            LocalDateTime registrationClosesAt,
            Long registeredTeams,
            Integer maxTeams,
            String prizePool,
            String region,
            String heroTag,
            String description,
            List<String> rules,
            List<TeamSummaryResponse> teams,
            List<MatchResponse> matches,
            List<LeaderboardEntryResponse> leaderboard
    ) {
    }

    public record CreateTournamentRequest(
            @NotBlank String name,
            @NotBlank String gameTitle,
            @NotBlank String format,
            @NotBlank String description,
            @NotBlank String region,
            @NotNull @Future LocalDateTime startAt,
            @NotNull @Future LocalDateTime registrationClosesAt,
            @NotNull @Min(2) Integer maxTeams,
            @NotBlank String prizePool,
            @NotBlank String heroTag,
            @NotEmpty List<String> rules
    ) {
    }
}

