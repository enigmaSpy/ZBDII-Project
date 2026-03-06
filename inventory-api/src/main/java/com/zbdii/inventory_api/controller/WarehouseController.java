package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.AddWarehouseRequest;
import com.zbdii.inventory_api.service.JwtService;
import com.zbdii.inventory_api.service.WarehouseService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {
    private final WarehouseService warehouseService;
    private final JwtService jwtService;

    public WarehouseController(WarehouseService warehouseService, JwtService jwtService){
        this.warehouseService = warehouseService;
        this.jwtService = jwtService;
    }
    @PostMapping
    public String createWarehouse(
            @RequestBody AddWarehouseRequest request,
            @RequestHeader("Authorization") String authHeader
            ){
        Long executorId = jwtService.extractUserId(authHeader);
        warehouseService.addWarehouse(request, executorId);
        return "Magazyn '"+request.name()+"' utworzony przez ID: "+executorId;
    }
}
