package com.zbdii.inventory_api.record;

public record WareHouseRequest(
        String name,
        String street,
        String city,
        String country
) {
}
