package com.zbdii.inventory_api.record;

public record CreateUserRequest(
        String role,
        String name,
        String email,
        String password
) {}