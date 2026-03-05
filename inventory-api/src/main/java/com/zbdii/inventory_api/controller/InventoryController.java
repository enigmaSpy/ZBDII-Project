package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.InventoryOperationRequest;
import com.zbdii.inventory_api.service.InventoryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private  final InventoryService inventoryService;
    public  InventoryController(InventoryService inventoryService){
        this.inventoryService = inventoryService;
    }

    @PostMapping("/restock")
    public String restock(
            @RequestBody InventoryOperationRequest request,
            @RequestParam Long executor_id
    ){
        inventoryService.restock(request, executor_id);
        return "restock product: "+request.id_product();
    }
    @PostMapping("/dispatch")
    public String dispatch(
            @RequestBody InventoryOperationRequest request,
            @RequestParam Long executor_id
    ){
        inventoryService.dispatch(request, executor_id);
        return "dispatch product: "+request.id_product();
    }
}
