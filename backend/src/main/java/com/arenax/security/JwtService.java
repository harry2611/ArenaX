package com.arenax.security;

import com.arenax.entity.Player;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${arena.jwt.secret}")
    private String jwtSecret;

    @Value("${arena.jwt.issuer}")
    private String issuer;

    @Value("${arena.jwt.expiration-minutes}")
    private long expirationMinutes;

    public String generateToken(Player player) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(player.getEmail())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
                .claim("role", player.getRole().name())
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && extractAllClaims(token).getExpiration().after(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] raw = jwtSecret.getBytes(StandardCharsets.UTF_8);
        byte[] normalized = raw.length >= 32 ? raw : Arrays.copyOf(raw, 32);
        return Keys.hmacShaKeyFor(normalized);
    }
}

