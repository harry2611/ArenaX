package com.arenax.service;

import com.arenax.entity.ArenaNotification;
import com.arenax.entity.ChatMessage;
import com.arenax.entity.Friendship;
import com.arenax.entity.LeaderboardEntry;
import com.arenax.entity.Match;
import com.arenax.entity.Player;
import com.arenax.entity.Team;
import com.arenax.entity.TeamMembership;
import com.arenax.entity.Tournament;
import com.arenax.entity.TournamentRegistration;
import com.arenax.enums.FriendshipStatus;
import com.arenax.enums.MatchStatus;
import com.arenax.enums.TeamMembershipRole;
import com.arenax.enums.TournamentStatus;
import com.arenax.enums.UserRole;
import com.arenax.repository.ArenaNotificationRepository;
import com.arenax.repository.ChatMessageRepository;
import com.arenax.repository.FriendshipRepository;
import com.arenax.repository.LeaderboardEntryRepository;
import com.arenax.repository.MatchRepository;
import com.arenax.repository.PlayerRepository;
import com.arenax.repository.TeamMembershipRepository;
import com.arenax.repository.TeamRepository;
import com.arenax.repository.TournamentRegistrationRepository;
import com.arenax.repository.TournamentRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SeedDataService {

    private final PlayerRepository playerRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final TeamMembershipRepository teamMembershipRepository;
    private final TournamentRegistrationRepository registrationRepository;
    private final MatchRepository matchRepository;
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final FriendshipRepository friendshipRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ArenaNotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void seed() {
        if (playerRepository.count() > 0) {
            return;
        }

        Player captain = createPlayer("captain", "captain@arenax.gg", "Nova Captain", 18, 3, 31, UserRole.PLAYER);
        Player pro = createPlayer("pro", "pro@arenax.gg", "Pro Fragger", 24, 6, 12, UserRole.PLAYER);
        Player rookie = createPlayer("rookie", "rookie@arenax.gg", "Rookie Support", 7, 5, 87, UserRole.PLAYER);
        Player admin = createPlayer("admin", "admin@arenax.gg", "Arena Admin", 0, 0, 1, UserRole.ADMIN);

        Team nova = createTeam("Nova", "NA West", captain);
        Team ember = createTeam("Ember", "NA East", pro);

        createMembership(nova, captain, TeamMembershipRole.CAPTAIN);
        createMembership(ember, pro, TeamMembershipRole.CAPTAIN);
        createMembership(nova, rookie, TeamMembershipRole.MEMBER);

        Tournament liveTournament = tournamentRepository.save(Tournament.builder()
                .name("Nightfall Masters")
                .gameTitle("Valorant")
                .formatName("5v5 Elimination")
                .region("North America")
                .description("High-intensity mobile-first community tournament with live bracket tracking and squad comms.")
                .startAt(LocalDateTime.now().minusHours(2))
                .registrationClosesAt(LocalDateTime.now().minusDays(1))
                .maxTeams(16)
                .prizePool("$5,000")
                .heroTag("Prime Time")
                .rulesText("Check in 30 minutes early|Screenshot result disputes within 10 minutes|Unsportsmanlike conduct triggers auto review")
                .status(TournamentStatus.LIVE)
                .build());

        Tournament upcomingTournament = tournamentRepository.save(Tournament.builder()
                .name("Solar Clash Invitational")
                .gameTitle("Rocket League")
                .formatName("3v3 Swiss")
                .region("Global")
                .description("Cross-region tournament with seeded rounds, leaderboard points, and friend-driven team invites.")
                .startAt(LocalDateTime.now().plusDays(4))
                .registrationClosesAt(LocalDateTime.now().plusDays(2))
                .maxTeams(32)
                .prizePool("$12,000")
                .heroTag("Open Qualifier")
                .rulesText("Top 8 make playoffs|Captains must confirm roster locks|Late forfeits reduce leaderboard standing")
                .status(TournamentStatus.UPCOMING)
                .build());

        registerTeam(liveTournament, nova);
        registerTeam(liveTournament, ember);
        registerTeam(upcomingTournament, nova);

        leaderboardEntryRepository.save(LeaderboardEntry.builder()
                .tournament(liveTournament)
                .team(nova)
                .points(9)
                .wins(3)
                .losses(0)
                .streak("W3")
                .build());
        leaderboardEntryRepository.save(LeaderboardEntry.builder()
                .tournament(liveTournament)
                .team(ember)
                .points(6)
                .wins(2)
                .losses(1)
                .streak("W1")
                .build());
        leaderboardEntryRepository.save(LeaderboardEntry.builder()
                .tournament(upcomingTournament)
                .team(nova)
                .points(0)
                .wins(0)
                .losses(0)
                .streak("-")
                .build());

        Match semiFinal = matchRepository.save(Match.builder()
                .tournament(liveTournament)
                .roundLabel("Semi Final A")
                .teamA(nova)
                .teamB(ember)
                .teamAScore(2)
                .teamBScore(1)
                .scheduledAt(LocalDateTime.now().minusMinutes(40))
                .status(MatchStatus.LIVE)
                .winner(null)
                .build());

        chatMessageRepository.save(ChatMessage.builder()
                .match(semiFinal)
                .sender(captain)
                .content("GG on map one. Reset and hold mid tighter.")
                .sentAt(LocalDateTime.now().minusMinutes(25))
                .build());
        chatMessageRepository.save(ChatMessage.builder()
                .match(semiFinal)
                .sender(pro)
                .content("Copy that. We are switching comps for the decider.")
                .sentAt(LocalDateTime.now().minusMinutes(18))
                .build());

        friendshipRepository.save(Friendship.builder()
                .requester(captain)
                .addressee(pro)
                .status(FriendshipStatus.ACCEPTED)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build());
        friendshipRepository.save(Friendship.builder()
                .requester(captain)
                .addressee(rookie)
                .status(FriendshipStatus.PENDING)
                .createdAt(LocalDateTime.now().minusHours(7))
                .build());

        notificationRepository.save(ArenaNotification.builder()
                .recipient(captain)
                .title("Bracket update")
                .body("Nightfall Masters semi-final is live now. Team Nova is queued on stream.")
                .createdAt(LocalDateTime.now().minusMinutes(30))
                .build());
        notificationRepository.save(ArenaNotification.builder()
                .recipient(captain)
                .title("Friend activity")
                .body("Rookie Support still needs to respond to your ArenaX invite.")
                .createdAt(LocalDateTime.now().minusHours(2))
                .build());
        notificationRepository.save(ArenaNotification.builder()
                .recipient(pro)
                .title("Team reminder")
                .body("Ember check-in closes in 15 minutes for Nightfall Masters.")
                .createdAt(LocalDateTime.now().minusMinutes(45))
                .build());
        notificationRepository.save(ArenaNotification.builder()
                .recipient(admin)
                .title("Admin feed")
                .body("ArenaX seed data loaded with tournaments, chat, and social graph samples.")
                .createdAt(LocalDateTime.now().minusMinutes(5))
                .build());
    }

    private Player createPlayer(
            String username,
            String email,
            String displayName,
            int wins,
            int losses,
            int rank,
            UserRole role
    ) {
        return playerRepository.save(Player.builder()
                .username(username)
                .email(email)
                .displayName(displayName)
                .passwordHash(passwordEncoder.encode("password123"))
                .rank(rank)
                .preferredRole("Flex")
                .favoriteGame("Valorant")
                .wins(wins)
                .losses(losses)
                .role(role)
                .build());
    }

    private Team createTeam(String name, String region, Player captain) {
        return teamRepository.save(Team.builder()
                .name(name)
                .region(region)
                .inviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .captain(captain)
                .build());
    }

    private void createMembership(Team team, Player player, TeamMembershipRole role) {
        teamMembershipRepository.save(TeamMembership.builder()
                .team(team)
                .player(player)
                .role(role)
                .build());
    }

    private void registerTeam(Tournament tournament, Team team) {
        registrationRepository.save(TournamentRegistration.builder()
                .tournament(tournament)
                .team(team)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build());
    }
}

