package com.arenax.repository;

import com.arenax.entity.ArenaNotification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArenaNotificationRepository extends JpaRepository<ArenaNotification, Long> {

    List<ArenaNotification> findByRecipient_IdOrderByCreatedAtDesc(Long recipientId);
}

