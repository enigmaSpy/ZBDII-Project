package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.WareHouseRequest;
import com.zbdii.inventory_api.service.WarehouseService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {
    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService){
        this.warehouseService = warehouseService;
    }
    @PostMapping
    public String createWarehouse(
            @RequestBody WareHouseRequest request, //@RequestBody zmaina jsona na nasz record
            @RequestParam Long executorId
            ){
        warehouseService.addWarehouse(request, executorId);
        return "Magazyn '"+request.name()+"' utworzony przez ID: "+executorId;
    }
}
