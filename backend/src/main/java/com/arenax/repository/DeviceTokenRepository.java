package com.arenax.repository;

import com.arenax.entity.DeviceToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    Optional<DeviceToken> findByPlayer_IdAndToken(Long playerId, String token);
}
