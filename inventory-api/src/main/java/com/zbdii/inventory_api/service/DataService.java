package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.ProductDto;
import com.zbdii.inventory_api.record.WarehouseDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DataService {
    private final JdbcTemplate jdbcTemplate;
    public DataService(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ProductDto> getAllProducts(){
        String sql = "SELECT id, name FROM Products ORDER BY name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new ProductDto(rs.getLong("id"), rs.getString("name"))
        );
    }

    public List<WarehouseDto> getAllWarehouses(){
        String sql = "SELECT id, name FROM Warehouses ORDER BY name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum)->
                new WarehouseDto(rs.getLong("id"), rs.getString("name") ));
    }
}
