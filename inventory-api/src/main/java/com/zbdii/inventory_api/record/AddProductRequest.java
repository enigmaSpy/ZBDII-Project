package com.zbdii.inventory_api.record;

public record AddProductRequest(
        String name,
        Double price_buy,
        Double price_sell,
        String p_desc,
        Long id_supplier
) {
}
