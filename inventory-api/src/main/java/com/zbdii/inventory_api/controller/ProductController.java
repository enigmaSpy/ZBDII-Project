package com.zbdii.inventory_api.controller;

import com.zbdii.inventory_api.record.AddProductRequest;
import com.zbdii.inventory_api.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping
    public String addProduct(
           @RequestBody AddProductRequest request,
           @RequestParam Long executorId){
        productService.addProduct(request, executorId);
        return "Dodano produkt: "+ request.name();
    }
}
