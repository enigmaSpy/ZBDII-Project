package com.zbdii.inventory_api.record;

public record LoginResponse(
        String token,
        String message
) {}