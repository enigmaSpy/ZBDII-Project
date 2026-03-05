package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.InventoryOperationRequest;
import com.zbdii.inventory_api.service.InventoryService;
import com.zbdii.inventory_api.service.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private  final InventoryService inventoryService;
    private final JwtService jwtService;
    public  InventoryController(InventoryService inventoryService, JwtService jwtService){
        this.inventoryService = inventoryService;
        this.jwtService = jwtService;
    }

    @PostMapping("/restock")
    public String restock(
            @RequestBody InventoryOperationRequest request,
            @RequestHeader("Authorization") String authHeader
    ){
        Long executor_id = jwtService.extractUserId(authHeader);
        inventoryService.restock(request, executor_id);
        return "restock product: "+request.id_product();
    }
    @PostMapping("/dispatch")
    public String dispatch(
            @RequestBody InventoryOperationRequest request,
            @RequestHeader("Authorization") String authHeader
    ){
        Long executor_id = jwtService.extractUserId(authHeader);
        inventoryService.dispatch(request, executor_id);
        return "dispatch product: "+request.id_product();
    }
}
