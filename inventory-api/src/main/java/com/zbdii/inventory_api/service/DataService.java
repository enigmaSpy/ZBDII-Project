package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.ProductDto;
import com.zbdii.inventory_api.record.SupplierDto;
import com.zbdii.inventory_api.record.WarehouseDto;
import com.zbdii.inventory_api.record.WarehouseSummaryDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataService {
    private final JdbcTemplate jdbcTemplate;

    public DataService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ProductDto> getAllProducts() {
        String sql = "SELECT id, name, is_active FROM Products ORDER BY name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new ProductDto(rs.getLong("id"), rs.getString("name"), rs.getInt("is_active"))
        );
    }

    public List<WarehouseDto> getAllWarehouses() {
        String sql = "SELECT id, name FROM Warehouses ORDER BY name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new WarehouseDto(rs.getLong("id"), rs.getString("name")));
    }

    public List<WarehouseSummaryDto> getWarehouseSummaries() {
        String sql = "SELECT warehouse_id, warehouse_name, total_items, total_value FROM v_warehouse_summary ORDER BY warehouse_name";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new WarehouseSummaryDto(
                        rs.getLong("warehouse_id"),
                        rs.getString("warehouse_name"),
                        rs.getInt("total_items"),
                        rs.getDouble("total_value")
                )
        );
    }

    public List<SupplierDto> getAllSupplayers() {
        String sql = "SELECT id, name, city, country, email, phone, is_active FROM Suppliers";

        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new SupplierDto(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("city"),
                        rs.getString("country"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getInt("is_active")
                ));
    }
}
