package com.arenax.service;

import com.arenax.dto.social.SocialDtos;
import com.arenax.entity.Friendship;
import com.arenax.entity.Player;
import com.arenax.enums.FriendshipStatus;
import com.arenax.repository.FriendshipRepository;
import com.arenax.repository.PlayerRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final FriendshipRepository friendshipRepository;
    private final PlayerRepository playerRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<SocialDtos.FriendResponse> getFriends(Player player) {
        return friendshipRepository.findAllForPlayer(player.getId())
                .stream()
                .map(friendship -> {
                    Player counterpart = friendship.getRequester().getId().equals(player.getId())
                            ? friendship.getAddressee()
                            : friendship.getRequester();

                    return new SocialDtos.FriendResponse(
                            friendship.getId(),
                            counterpart.getDisplayName(),
                            counterpart.getUsername(),
                            counterpart.getRank(),
                            friendship.getStatus()
                    );
                })
                .toList();
    }

    @Transactional
    public void sendFriendRequest(Player player, SocialDtos.SendFriendRequest request) {
        Player target = playerRepository.findByUsernameIgnoreCase(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        if (player.getId().equals(target.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot friend yourself");
        }

        if (friendshipRepository.existsRelationship(player.getId(), target.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Friend relationship already exists");
        }

        friendshipRepository.save(Friendship.builder()
                .requester(player)
                .addressee(target)
                .status(FriendshipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build());

        notificationService.notifyUser(
                target,
                "Friend request",
                player.getDisplayName() + " invited you to connect on ArenaX."
        );
    }

    @Transactional
    public void acceptFriendRequest(Player player, Long friendshipId) {
        Friendship friendship = friendshipRepository.findByIdAndAddressee_Id(friendshipId, player.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend request not found"));

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        notificationService.notifyUser(
                friendship.getRequester(),
                "Friend request accepted",
                player.getDisplayName() + " accepted your ArenaX invite."
        );
    }
}

