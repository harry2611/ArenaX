package com.arenax.service;

import com.arenax.dto.ProfileResponse;
import com.arenax.dto.tournament.TournamentDtos;
import com.arenax.entity.Player;
import com.arenax.entity.Team;
import com.arenax.entity.TeamMembership;
import com.arenax.enums.FriendshipStatus;
import com.arenax.repository.FriendshipRepository;
import com.arenax.repository.TeamMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final TeamMembershipRepository teamMembershipRepository;
    private final FriendshipRepository friendshipRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Player player) {
        TeamMembership membership = teamMembershipRepository.findFirstByPlayer_IdOrderByIdAsc(player.getId()).orElse(null);
        TournamentDtos.TeamSummaryResponse teamSummary = membership == null ? null : toTeamSummary(membership.getTeam());
        long friendsCount = friendshipRepository.countByPlayerIdAndStatus(player.getId(), FriendshipStatus.ACCEPTED);

        return new ProfileResponse(
                player.getId(),
                player.getUsername(),
                player.getEmail(),
                player.getDisplayName(),
                player.getRank(),
                player.getPreferredRole(),
                player.getFavoriteGame(),
                player.getWins(),
                player.getLosses(),
                friendsCount,
                teamSummary
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
}

