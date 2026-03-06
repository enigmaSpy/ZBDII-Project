package com.zbdii.inventory_api.record;

import java.sql.Timestamp;

public record LogDto(
        String emailAttempted, Integer isSuccess, String ipAddress, Timestamp occurredAt
) {
}
