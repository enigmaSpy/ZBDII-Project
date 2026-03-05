package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.CreateUserRecord;
import com.zbdii.inventory_api.record.UserResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final JdbcTemplate jdbcTemplate;

    public UserService(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public void addUser(CreateUserRecord record, Long executorId){
        String sql = "CALL pkg_admin.prc_create_user(?,?,?,?,?)";

        jdbcTemplate.update(sql,
                record.role(),
                record.name(),
                record.email(),
                record.passwordHash(),
                executorId);
    }

    public String toggleUser(Long id, Long executorId){
        jdbcTemplate.update("CALL pkg_admin.prc_toggle_user(?,?)", id,executorId);
        return "Sygnał wysłany: Cel (ID: " + id + ") przełączony przez Wykonawcę (ID: " + executorId + ").";
    }

    public UserResponse getUser(Long id){
        String sql = "SELECT id, name, email, is_active FROM Users WHERE id =?";

        return jdbcTemplate.queryForObject(sql,
                (rs, rowNum) -> new UserResponse(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getInt("is_active")
                ), id
        );
    }
}
