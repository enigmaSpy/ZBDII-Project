package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.InventoryOperationRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

@Service
public class InventoryService {
    private final JdbcTemplate jdbcTemplate;

    public  InventoryService(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    @PostMapping("/restock")
    public void restock(InventoryOperationRequest request, Long executor_id){
        String sql = "CALL pkg_inventory.prc_restock(?,?,?,?)";
        jdbcTemplate.update(sql,
                request.id_product(),
                request.id_warehouse(),
                request.quantity(),
                executor_id);
    }
    @PostMapping("/dispatch")
    public void dispatch(InventoryOperationRequest request, Long executor_id){
        String sql = "CALL pkg_inventory.prc_dispatch(?,?,?,?)";
        jdbcTemplate.update(sql,
                request.id_product(),
                request.id_warehouse(),
                request.quantity(),
                executor_id);
    }
}
