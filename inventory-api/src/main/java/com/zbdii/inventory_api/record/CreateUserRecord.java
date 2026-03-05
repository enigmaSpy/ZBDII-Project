package com.zbdii.inventory_api.record;

public record CreateUserRecord(
        String role,
        String name,
        String email,
        String passwordHash
) {
}
