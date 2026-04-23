package com.arenax.service;

import com.arenax.dto.tournament.TournamentDtos;
import com.arenax.entity.LeaderboardEntry;
import com.arenax.entity.Match;
import com.arenax.entity.Player;
import com.arenax.entity.Team;
import com.arenax.entity.TeamMembership;
import com.arenax.entity.Tournament;
import com.arenax.entity.TournamentRegistration;
import com.arenax.enums.TeamMembershipRole;
import com.arenax.enums.TournamentStatus;
import com.arenax.enums.UserRole;
import com.arenax.repository.LeaderboardEntryRepository;
import com.arenax.repository.MatchRepository;
import com.arenax.repository.TeamMembershipRepository;
import com.arenax.repository.TeamRepository;
import com.arenax.repository.TournamentRegistrationRepository;
import com.arenax.repository.TournamentRepository;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;
    private final MatchRepository matchRepository;
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final TeamRepository teamRepository;
    private final TeamMembershipRepository teamMembershipRepository;
    private final NotificationService notificationService;
    private final RealtimeService realtimeService;

    @Transactional(readOnly = true)
    public List<TournamentDtos.TournamentSummaryResponse> getTournaments() {
        return tournamentRepository.findAllByOrderByStartAtAsc()
                .stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public TournamentDtos.TournamentDetailResponse getTournament(Long tournamentId) {
        Tournament tournament = getTournamentEntity(tournamentId);
        long registeredTeams = registrationRepository.countByTournament_Id(tournament.getId());

        List<TournamentDtos.TeamSummaryResponse> teams = registrationRepository.findByTournament_Id(tournamentId)
                .stream()
                .map(TournamentRegistration::getTeam)
                .map(this::toTeamSummary)
                .toList();

        List<TournamentDtos.MatchResponse> matches = matchRepository.findByTournament_IdOrderByScheduledAtAsc(tournamentId)
                .stream()
                .map(this::toMatchResponse)
                .toList();

        List<TournamentDtos.LeaderboardEntryResponse> leaderboard = getLeaderboard(tournamentId);

        return new TournamentDtos.TournamentDetailResponse(
                tournament.getId(),
                tournament.getName(),
                tournament.getGameTitle(),
                tournament.getFormatName(),
                tournament.getStatus(),
                tournament.getStartAt(),
                tournament.getRegistrationClosesAt(),
                registeredTeams,
                tournament.getMaxTeams(),
                tournament.getPrizePool(),
                tournament.getRegion(),
                tournament.getHeroTag(),
                tournament.getDescription(),
                Arrays.stream(tournament.getRulesText().split("\\|")).toList(),
                teams,
                matches,
                leaderboard
        );
    }

    @Transactional
    public void joinTournament(Player player, Long tournamentId) {
        Tournament tournament = getTournamentEntity(tournamentId);

        if (tournament.getRegistrationClosesAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration is closed");
        }

        Team team = teamMembershipRepository.findFirstByPlayer_IdOrderByIdAsc(player.getId())
                .map(TeamMembership::getTeam)
                .orElseGet(() -> createSoloTeam(player));

        if (registrationRepository.existsByTournament_IdAndTeam_Id(tournamentId, team.getId())) {
            return;
        }

        long currentRegistrations = registrationRepository.countByTournament_Id(tournamentId);
        if (currentRegistrations >= tournament.getMaxTeams()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tournament is full");
        }

        registrationRepository.save(TournamentRegistration.builder()
                .tournament(tournament)
                .team(team)
                .createdAt(LocalDateTime.now())
                .build());

        if (!leaderboardEntryRepository.existsByTournament_IdAndTeam_Id(tournamentId, team.getId())) {
            leaderboardEntryRepository.save(LeaderboardEntry.builder()
                    .tournament(tournament)
                    .team(team)
                    .points(0)
                    .wins(0)
                    .losses(0)
                    .streak("-")
                    .build());
        }

        notificationService.notifyUser(
                player,
                "Tournament joined",
                "Your team is now registered for " + tournament.getName() + "."
        );
        realtimeService.broadcastLeaderboard(tournamentId, getLeaderboard(tournamentId));
    }

    @Transactional
    public TournamentDtos.TournamentSummaryResponse createTournament(
            Player player,
            TournamentDtos.CreateTournamentRequest request
    ) {
        if (player.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can create tournaments");
        }

        Tournament tournament = tournamentRepository.save(Tournament.builder()
                .name(request.name())
                .gameTitle(request.gameTitle())
                .formatName(request.format())
                .description(request.description())
                .region(request.region())
                .startAt(request.startAt())
                .registrationClosesAt(request.registrationClosesAt())
                .maxTeams(request.maxTeams())
                .prizePool(request.prizePool())
                .heroTag(request.heroTag())
                .rulesText(String.join("|", request.rules()))
                .status(TournamentStatus.UPCOMING)
                .build());

        return toSummary(tournament);
    }

    private Team createSoloTeam(Player player) {
        Team team = teamRepository.save(Team.builder()
                .name(player.getDisplayName() + " Solo")
                .region("Global")
                .inviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT))
                .captain(player)
                .build());

        teamMembershipRepository.save(TeamMembership.builder()
                .team(team)
                .player(player)
                .role(TeamMembershipRole.CAPTAIN)
                .build());
        return team;
    }

    private Tournament getTournamentEntity(Long tournamentId) {
        return tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));
    }

    private TournamentDtos.TournamentSummaryResponse toSummary(Tournament tournament) {
        return new TournamentDtos.TournamentSummaryResponse(
                tournament.getId(),
                tournament.getName(),
                tournament.getGameTitle(),
                tournament.getFormatName(),
                tournament.getStatus(),
                tournament.getStartAt(),
                tournament.getRegistrationClosesAt(),
                registrationRepository.countByTournament_Id(tournament.getId()),
                tournament.getMaxTeams(),
                tournament.getPrizePool(),
                tournament.getRegion(),
                tournament.getHeroTag()
        );
    }

    private TournamentDtos.TeamSummaryResponse toTeamSummary(Team team) {
        return new TournamentDtos.TeamSummaryResponse(
                team.getId(),
                team.getName(),
                team.getRegion(),
                team.getCaptain().getDisplayName(),
                teamMembershipRepository.countByTeam_Id(team.getId()),
                team.getInviteCode()
        );
    }

    private TournamentDtos.MatchResponse toMatchResponse(Match match) {
        return new TournamentDtos.MatchResponse(
                match.getId(),
                match.getRoundLabel(),
                match.getTeamA().getName(),
                match.getTeamB().getName(),
                match.getTeamAScore(),
                match.getTeamBScore(),
                match.getScheduledAt(),
                match.getStatus(),
                match.getWinner() == null ? null : match.getWinner().getName()
        );
    }

    public List<TournamentDtos.LeaderboardEntryResponse> getLeaderboard(Long tournamentId) {
        return leaderboardEntryRepository.findByTournament_IdOrderByPointsDescWinsDesc(tournamentId)
                .stream()
                .map(entry -> new TournamentDtos.LeaderboardEntryResponse(
                        entry.getId(),
                        entry.getTeam().getId(),
                        entry.getTeam().getName(),
                        entry.getPoints(),
                        entry.getWins(),
                        entry.getLosses(),
                        entry.getStreak()
                ))
                .toList();
    }
}

