package com.arenax.repository;

import com.arenax.entity.TeamMembership;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMembershipRepository extends JpaRepository<TeamMembership, Long> {

    Optional<TeamMembership> findFirstByPlayer_IdOrderByIdAsc(Long playerId);

    long countByTeam_Id(Long teamId);

    boolean existsByPlayer_Id(Long playerId);
}

