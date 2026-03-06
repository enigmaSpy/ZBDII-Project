package com.zbdii.inventory_api.controller;


import com.zbdii.inventory_api.record.AddSupplierRequest;
import com.zbdii.inventory_api.service.JwtService;
import com.zbdii.inventory_api.service.SupplierService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;
    private final JwtService jwtService;
    public SupplierController(SupplierService supplierService,JwtService jwtService){
        this.supplierService = supplierService;
        this.jwtService =jwtService;
    }

    @PostMapping
    public String addSupplier(
            @RequestBody AddSupplierRequest request,
            @RequestHeader("Authorization") String authHeader
            ){
        Long executorId = jwtService.extractUserId(authHeader);
        supplierService.addSuplier(request, executorId);
        return "Dodano dostawcę: "+ request.name();
    }


}
