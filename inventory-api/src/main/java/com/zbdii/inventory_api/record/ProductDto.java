package com.zbdii.inventory_api.record;

public record ProductDto(
    Long id,
    String name,
    int isActive,
    Double priceBuy,
    Double priceSell,
    String p_desc,
    String supplierName,
    Long idSupplier
) {}