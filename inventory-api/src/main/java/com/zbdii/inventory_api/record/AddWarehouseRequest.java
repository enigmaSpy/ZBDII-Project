package com.zbdii.inventory_api.record;

public record AddWarehouseRequest(
        String name,
        String street,
        String city,
        String country,
        Long executor_id
) {
}
