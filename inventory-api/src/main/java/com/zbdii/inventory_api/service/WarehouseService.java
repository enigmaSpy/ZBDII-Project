package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.AddWarehouseRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class WarehouseService {
    private final JdbcTemplate jdbcTemplate;

    public WarehouseService(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public void  addWarehouse(AddWarehouseRequest request, Long executorId){
        String sql = "CALL pkg_admin.prc_add_warehouse(?,?,?,?,?)";

        jdbcTemplate.update(sql,
                request.name(),
                request.street(),
                request.city(),
                request.country(),
                executorId
                );
    }

}
