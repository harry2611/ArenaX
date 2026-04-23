package com.arenax.repository;

import com.arenax.entity.Tournament;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    List<Tournament> findAllByOrderByStartAtAsc();
}

