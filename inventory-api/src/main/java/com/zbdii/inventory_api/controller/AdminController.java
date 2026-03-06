package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.CreateUserRequest;
import com.zbdii.inventory_api.record.UserDto;
import com.zbdii.inventory_api.service.AdminService;
import com.zbdii.inventory_api.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/workers")
public class AdminController {

    private final AdminService adminService;
    private final JwtService jwtService;

    public AdminController(AdminService adminService, JwtService jwtService) {
        this.adminService = adminService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<UserDto> getWorkers(@RequestHeader("Authorization") String authHeader) {
        return adminService.getAllUsers();
    }

    @PostMapping
    public String createWorker(
            @RequestBody CreateUserRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long executorId = jwtService.extractUserId(authHeader);
        adminService.createUser(request, executorId);
        return "Utworzono użytkownika: " + request.email();
    }
}