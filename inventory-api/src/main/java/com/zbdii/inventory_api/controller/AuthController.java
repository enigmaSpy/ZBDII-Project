package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.LoginRequest;
import com.zbdii.inventory_api.record.LoginResponse;
import com.zbdii.inventory_api.record.LoginResult;
import com.zbdii.inventory_api.service.AuthService;
import com.zbdii.inventory_api.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
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
}
