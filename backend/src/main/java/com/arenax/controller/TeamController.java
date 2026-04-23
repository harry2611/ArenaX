package com.arenax.controller;

import com.arenax.dto.team.TeamDtos;
import com.arenax.dto.tournament.TournamentDtos;
import com.arenax.security.ArenaUserPrincipal;
import com.arenax.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public TournamentDtos.TeamSummaryResponse createTeam(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @Valid @RequestBody TeamDtos.CreateTeamRequest request
    ) {
        return teamService.createTeam(principal.player(), request);
    }
}

