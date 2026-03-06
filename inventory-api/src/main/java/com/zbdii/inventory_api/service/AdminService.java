package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.CreateUserRequest;
import com.zbdii.inventory_api.record.LogDto;
import com.zbdii.inventory_api.record.UserDto;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final JdbcTemplate jdbcTemplate;


    public AdminService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<UserDto> getAllUsers() {
        String sql = "SELECT id, email, role, is_active FROM Users";
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new UserDto(
                        rs.getLong("id"),
                        rs.getString("email"),
                        rs.getString("role"),
                        rs.getInt("is_active")
                ));
    }

    public void createUser(CreateUserRequest request, Long executorId) {
        String sql = "CALL pkg_admin.prc_create_user(?, ?, ?, ?, ?)";

        String temporaryPassword = request.password();

        jdbcTemplate.update(sql,
                request.role(),
                request.name(),
                request.email(),
                temporaryPassword,
                executorId
        );
    }
    public List<LogDto> getLoginLogs() {
        String sql = "SELECT email_attempted, is_success, ipaddress, occurred_at FROM Login_Logs";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new LogDto(
                rs.getString("email_attempted"),
                rs.getInt("is_success"),
                rs.getString("ipaddress"),
                rs.getTimestamp("occurred_at")
        ));
    }
}