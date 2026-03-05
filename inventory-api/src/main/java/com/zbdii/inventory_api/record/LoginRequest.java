package com.zbdii.inventory_api.record;

public record LoginRequest(
        String email,
        String passwordHash
) {
}
