package com.zbdii.inventory_api.record;

public record ProductDetailsDto(
            Long id,
            String name,
            Double priceBuy,
            Double priceSell,
            String desc,
            int isActive,
            Long supplierId,
            String supplierName
) {
}
