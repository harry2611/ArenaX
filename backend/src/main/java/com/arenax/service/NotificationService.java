package com.arenax.service;

import com.arenax.dto.NotificationDtos;
import com.arenax.entity.ArenaNotification;
import com.arenax.entity.DeviceToken;
import com.arenax.entity.Player;
import com.arenax.repository.ArenaNotificationRepository;
import com.arenax.repository.DeviceTokenRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final ArenaNotificationRepository notificationRepository;
    private final DeviceTokenRepository deviceTokenRepository;

    @Transactional(readOnly = true)
    public List<NotificationDtos.NotificationResponse> getNotifications(Player player) {
        return notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(player.getId())
                .stream()
                .map(notification -> new NotificationDtos.NotificationResponse(
                        notification.getId(),
                        notification.getTitle(),
                        notification.getBody(),
                        notification.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public void registerDevice(Player player, NotificationDtos.DeviceRegistrationRequest request) {
        boolean exists = deviceTokenRepository.findByPlayer_IdAndToken(player.getId(), request.token()).isPresent();
        if (!exists) {
            deviceTokenRepository.save(DeviceToken.builder()
                    .player(player)
                    .token(request.token())
                    .platform(request.platform())
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }

    @Transactional
    public void notifyUser(Player recipient, String title, String body) {
        notificationRepository.save(ArenaNotification.builder()
                .recipient(recipient)
                .title(title)
                .body(body)
                .createdAt(LocalDateTime.now())
                .build());
    }
}

