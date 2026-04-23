package com.arenax.service;

import com.arenax.dto.auth.AuthDtos;
import com.arenax.entity.Player;
import com.arenax.enums.UserRole;
import com.arenax.repository.PlayerRepository;
import com.arenax.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (playerRepository.existsByEmail(request.email().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        if (playerRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }

        Player player = playerRepository.save(Player.builder()
                .username(request.username().toLowerCase())
                .email(request.email().toLowerCase())
                .displayName(request.displayName())
                .passwordHash(passwordEncoder.encode(request.password()))
                .rank(100)
                .preferredRole("Flex")
                .favoriteGame("Valorant")
                .wins(0)
                .losses(0)
                .role(UserRole.PLAYER)
                .build());

        return toAuthResponse(player);
    }

    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        Player player = playerRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), player.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return toAuthResponse(player);
    }

    private AuthDtos.AuthResponse toAuthResponse(Player player) {
        AuthDtos.UserResponse user = new AuthDtos.UserResponse(
                player.getId(),
                player.getUsername(),
                player.getEmail(),
                player.getDisplayName(),
                player.getRank(),
                player.getPreferredRole(),
                player.getRole()
        );
        return new AuthDtos.AuthResponse(jwtService.generateToken(player), user);
    }
}

