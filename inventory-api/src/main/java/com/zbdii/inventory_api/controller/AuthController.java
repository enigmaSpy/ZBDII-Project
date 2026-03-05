package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.LoginRequest;
import com.zbdii.inventory_api.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public String login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
            ){
        String ipAddress = httpRequest.getRemoteAddr();
        Long userId = authService.loginUser(request, ipAddress);
        return "Zalogowano pomyślnie";
    }
}
