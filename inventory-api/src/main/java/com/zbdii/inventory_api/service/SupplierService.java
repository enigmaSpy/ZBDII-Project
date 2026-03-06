package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.AddSupplierRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SupplierService {
    private final JdbcTemplate jdbcTemplate;

    public SupplierService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void  addSuplier(AddSupplierRequest request, Long executorId){
        String sql = "CALL pkg_suppliers.prc_add_supplier(?,?,?,?,?,?,?)";

         jdbcTemplate.update(
                sql,
                request.name(),
                request.street(),
                request.city(),
                request.country(),
                request.email(),
                request.phone(),
                executorId
        );
    }

}
