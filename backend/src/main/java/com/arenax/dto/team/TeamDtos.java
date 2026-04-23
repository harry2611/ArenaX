package com.arenax.dto.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class TeamDtos {

    private TeamDtos() {
    }

    public record CreateTeamRequest(
            @NotBlank @Size(min = 3, max = 40) String name,
            @NotBlank @Size(min = 2, max = 40) String region
    ) {
    }
}

