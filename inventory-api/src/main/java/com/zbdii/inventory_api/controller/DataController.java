package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.*;
import com.zbdii.inventory_api.service.DataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataController {

    private final DataService dataService;

    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/products")
    public List<ProductDetailsDto> getProducts() {
        return dataService.getAllProducts();
    }

    @GetMapping("/warehouses")
    public List<WarehouseDto> getWarehouses() {
        return dataService.getAllWarehouses();
    }
    @GetMapping("/summary")
    public List<WarehouseSummaryDto> getSummary(){
        return dataService.getWarehouseSummaries();
    }

    @GetMapping("/suppliers")
    public List<SupplierDto> getSuppliers(){
        return dataService.getAllSupplayers();
    }
}