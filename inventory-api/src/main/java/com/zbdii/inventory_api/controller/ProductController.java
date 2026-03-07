package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.AddProductRequest;
import com.zbdii.inventory_api.service.JwtService;
import com.zbdii.inventory_api.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final JwtService jwtService;

    public ProductController(ProductService productService, JwtService jwtService){
        this.productService = productService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public String addProduct(
            @RequestBody AddProductRequest request,
            @RequestHeader("Authorization") String authHeader
            ){
        Long executorId = jwtService.extractUserId(authHeader);
        productService.addProduct(request, executorId);
        return "Dodano produkt: "+ request.name();
    }

    @PutMapping("{id}")
    public String editProduct(
            @PathVariable("id") Long productId,
            @RequestBody AddProductRequest request,
            @RequestHeader("Authorization") String authHeader
    ){
        Long executorId = jwtService.extractUserId(authHeader);
        productService.editProduct(productId, request, executorId);
        return "Zaktualizowano produkt nr: "+ productId;
    }
}
