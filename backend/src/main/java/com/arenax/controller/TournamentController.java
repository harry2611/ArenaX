package com.arenax.controller;

import com.arenax.dto.tournament.TournamentDtos;
import com.arenax.security.ArenaUserPrincipal;
import com.arenax.service.TournamentService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @GetMapping
    public List<TournamentDtos.TournamentSummaryResponse> getTournaments() {
        return tournamentService.getTournaments();
    }

    @GetMapping("/{tournamentId}")
    public TournamentDtos.TournamentDetailResponse getTournament(@PathVariable Long tournamentId) {
        return tournamentService.getTournament(tournamentId);
    }

    @PostMapping("/{tournamentId}/join")
    public void joinTournament(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @PathVariable Long tournamentId
    ) {
        tournamentService.joinTournament(principal.player(), tournamentId);
    }

    @PostMapping
    public TournamentDtos.TournamentSummaryResponse createTournament(
            @AuthenticationPrincipal ArenaUserPrincipal principal,
            @Valid @RequestBody TournamentDtos.CreateTournamentRequest request
    ) {
        return tournamentService.createTournament(principal.player(), request);
    }
}

