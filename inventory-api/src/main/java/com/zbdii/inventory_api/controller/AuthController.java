package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.ChangePasswordRequest;
import com.zbdii.inventory_api.record.LoginRequest;
import com.zbdii.inventory_api.record.LoginResponse;
import com.zbdii.inventory_api.record.LoginResult;
import com.zbdii.inventory_api.service.AuthService;
import com.zbdii.inventory_api.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final JdbcTemplate jdbcTemplate;

    public AuthController(AuthService authService, JwtService jwtService, JdbcTemplate jdbcTemplate) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
            ){
        String ipAddress = httpRequest.getRemoteAddr();
        LoginResult userData = authService.loginUser(request, ipAddress);
        String jwtToken = jwtService.generateToken(userData.id(), userData.role());
        return new LoginResponse(jwtToken,"Autentykacja zakończona sukcesem");
    }

    @PutMapping("/password")
    public void changePassword(
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String authHeader
    ){
        Long executorId = jwtService.extractUserId(authHeader);
        authService.changePassword(request, executorId);
    }
}
