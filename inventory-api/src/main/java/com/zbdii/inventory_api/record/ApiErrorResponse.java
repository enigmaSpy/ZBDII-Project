package com.zbdii.inventory_api.record;

public record ApiErrorResponse(
        int status,
        String message
) {
}
