package com.arenax.entity;

import com.arenax.enums.TournamentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String gameTitle;

    @Column(nullable = false)
    private String formatName;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false, length = 1500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime registrationClosesAt;

    @Column(nullable = false)
    private Integer maxTeams;

    @Column(nullable = false)
    private String prizePool;

    @Column(nullable = false)
    private String heroTag;

    @Column(nullable = false, length = 2000)
    private String rulesText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TournamentStatus status;
}

