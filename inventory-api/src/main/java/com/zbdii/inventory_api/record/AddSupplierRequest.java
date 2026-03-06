package com.zbdii.inventory_api.record;

public record AddSupplierRequest(
        String name,
        String street,
        String city,
        String country,
        String email,
        String phone
) {
}
