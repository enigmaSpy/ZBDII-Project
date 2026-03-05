package com.zbdii.inventory_api.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    private final long EXPIRATION_TIME = 86400000;//24h

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // Kto jest właścicielem biletu?
                .claim("role", "ADMIN") // Na razie wpisujemy ADMIN na sztywno, później podepniemy to pod bazę!
                .setIssuedAt(new Date()) // Czas wydania
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Czas wygaśnięcia
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Przybijamy pieczęć!
                .compact(); // Kompresujemy do jednego długiego łańcucha znaków
    }

    public Long extractUserId(String authHeader){
        String token = authHeader;
        if (authHeader !=null &&authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
        }

        String subjectId = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        return Long.parseLong(subjectId);
    }
}