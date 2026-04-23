package com.arenax.dto.social;

import com.arenax.enums.FriendshipStatus;
import jakarta.validation.constraints.NotBlank;

public final class SocialDtos {

    private SocialDtos() {
    }

    public record FriendResponse(
            Long id,
            String displayName,
            String username,
            Integer rank,
            FriendshipStatus status
    ) {
    }

    public record SendFriendRequest(@NotBlank String username) {
    }
}

