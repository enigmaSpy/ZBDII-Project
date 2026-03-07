package com.zbdii.inventory_api.record;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword
) {
}
