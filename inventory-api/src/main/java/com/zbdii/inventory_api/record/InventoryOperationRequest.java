package com.zbdii.inventory_api.record;

public record InventoryOperationRequest(
        Long id_product,
        Long id_warehouse,
        int quantity
) {
}
