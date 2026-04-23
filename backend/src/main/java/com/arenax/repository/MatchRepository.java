package com.arenax.repository;

import com.arenax.entity.Match;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByTournament_IdOrderByScheduledAtAsc(Long tournamentId);
}

