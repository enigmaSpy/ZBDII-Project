package com.zbdii.inventory_api.record;

public record SupplierDto(
        Long id,
        String name,
        String city,
        String country,
        String email,
        String phone,
        int isActive
) {}