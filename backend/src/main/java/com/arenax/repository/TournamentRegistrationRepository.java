package com.arenax.repository;

import com.arenax.entity.TournamentRegistration;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRegistrationRepository extends JpaRepository<TournamentRegistration, Long> {

    List<TournamentRegistration> findByTournament_Id(Long tournamentId);

    boolean existsByTournament_IdAndTeam_Id(Long tournamentId, Long teamId);

    long countByTournament_Id(Long tournamentId);
}

