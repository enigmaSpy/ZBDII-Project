package com.zbdii.inventory_api.service;

import com.zbdii.inventory_api.record.LoginRequest;
import com.zbdii.inventory_api.record.LoginResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Types;

@Service
public class AuthService {

    private final JdbcTemplate jdbcTemplate;

    public AuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LoginResult loginUser(LoginRequest request, String ipAddress) {
        String sql = "{call pkg_auth.prc_login(?, ?, ?, ?, ?)}";

        return jdbcTemplate.execute(sql, (CallableStatement cs) -> {

            cs.setString(1, request.email());
            cs.setString(2, request.passwordHash());
            cs.setString(3, ipAddress);

            cs.registerOutParameter(4, Types.NUMERIC);
            cs.registerOutParameter(5, Types.VARCHAR);
            cs.execute();

            long resultId = cs.getLong(4);
            String resultRole = cs.getString(5);


            return cs.wasNull() ? null : new LoginResult(resultId, resultRole);
        });
    }
}