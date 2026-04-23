package com.arenax.repository;

import com.arenax.entity.LeaderboardEntry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, Long> {

    List<LeaderboardEntry> findByTournament_IdOrderByPointsDescWinsDesc(Long tournamentId);

    boolean existsByTournament_IdAndTeam_Id(Long tournamentId, Long teamId);
}

