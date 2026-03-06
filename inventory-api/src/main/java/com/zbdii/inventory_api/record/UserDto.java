package com.zbdii.inventory_api.record;

public record UserDto(
        Long id,
        String email,
        String role,
        int isActive
) {}
