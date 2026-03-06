package com.zbdii.inventory_api.record;

public record WarehouseSummaryDto(
        Long warehouseId,
        String warehouseName,
        Integer totalItems,
        Double totalValue
) {
}
