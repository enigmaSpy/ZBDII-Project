package com.zbdii.inventory_api.record;

public record GetUser(
        Long id,
        String name,
        String email,
        int is_active
) {
}
