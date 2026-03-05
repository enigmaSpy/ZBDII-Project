package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.AddProductRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final JdbcTemplate jdbcTemplate;

    public ProductService(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public void addProduct(AddProductRequest request,Long executor_id){
        String sql = "CALL pkg_inventory.prc_add_product(?,?,?,?,?,?)";
        jdbcTemplate.update(sql,
                request.name(),
                request.price_buy(),
                request.price_sell(),
                request.p_desc(),
                request.id_supplier(),
                executor_id);
    }

}
