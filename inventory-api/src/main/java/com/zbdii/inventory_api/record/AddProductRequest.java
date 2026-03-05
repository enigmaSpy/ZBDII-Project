package com.zbdii.inventory_api.record;

public record AddProductRequest(
        String name,
        double price_buy,
        double price_sell,
        String p_desc,
        Long id_supplier
) {
}
