package com.arenax.service;

import com.arenax.dto.team.TeamDtos;
import com.arenax.dto.tournament.TournamentDtos;
import com.arenax.entity.Player;
import com.arenax.entity.Team;
import com.arenax.entity.TeamMembership;
import com.arenax.enums.TeamMembershipRole;
import com.arenax.repository.TeamMembershipRepository;
import com.arenax.repository.TeamRepository;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMembershipRepository teamMembershipRepository;
    private final NotificationService notificationService;

    @Transactional
    public TournamentDtos.TeamSummaryResponse createTeam(Player captain, TeamDtos.CreateTeamRequest request) {
        if (teamMembershipRepository.existsByPlayer_Id(captain.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player already belongs to a team");
        }

        Team team = teamRepository.save(Team.builder()
                .name(request.name())
                .region(request.region())
                .inviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT))
                .captain(captain)
                .build());

        teamMembershipRepository.save(TeamMembership.builder()
                .team(team)
                .player(captain)
                .role(TeamMembershipRole.CAPTAIN)
                .build());

        notificationService.notifyUser(
                captain,
                "Team created",
                "You are now captain of " + team.getName() + "."
        );

        return new TournamentDtos.TeamSummaryResponse(
                team.getId(),
                team.getName(),
                team.getRegion(),
                captain.getDisplayName(),
                1L,
                team.getInviteCode()
        );
    }
}

