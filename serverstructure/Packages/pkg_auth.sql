CREATE OR REPLACE PACKAGE pkg_auth IS 
    FUNCTION fn_check_login(
        p_email IN Users.email%TYPE,
        p_password_hash IN Users.password_hash%TYPE
    )RETURN Users.id%TYPE;
    PROCEDURE prc_login(
        p_email IN Users.email%TYPE,
        p_password_hash IN Users.password_hash%TYPE,
        p_ipaddress  IN Login_Logs.ipaddress%TYPE
    );
    PROCEDURE prc_register_login_attempt(
        p_email      IN Users.email%TYPE,
        p_is_success IN Login_Logs.is_success%TYPE,
        p_ipaddress  IN Login_Logs.ipaddress%TYPE,
        p_id_user    IN Login_Logs.id_user%TYPE
    );
    PROCEDURE prc_change_pass(
        p_id_user IN Users.id%TYPE,
        p_password_hash IN Users.password_hash%TYPE
    );
END pkg_auth;

CREATE OR REPLACE PACKAGE BODY pkg_auth IS
    FUNCTION fn_check_login(
    p_email IN Users.email%TYPE,
    p_password_hash IN Users.password_hash%TYPE
) RETURN Users.id%TYPE
IS
    v_id Users.id%TYPE;
BEGIN
    SELECT id
    INTO v_id
    FROM Users
    WHERE email = p_email
      AND password_hash = p_password_hash
      AND is_active = 1;

    RETURN v_id;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL; 
END fn_check_login;

  PROCEDURE prc_register_login_attempt(
        p_email      IN Login_Logs.email_attempted%TYPE,
        p_is_success IN Login_Logs.is_success%TYPE,
        p_ipaddress  IN Login_Logs.ipaddress%TYPE,
        p_id_user    IN Login_Logs.id_user%TYPE
    )IS 
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        INSERT INTO Login_Logs (
            is_success,
            email_attempted,
            ipaddress,
            id_user 
        )
        VALUES(
          p_is_success, p_email, p_ipaddress,p_id_user
        );
        COMMIT;
    END prc_register_login_attempt;

PROCEDURE prc_login(
        p_email      IN Users.email%TYPE,
        p_password_hash IN Users.password_hash%TYPE,
        p_ipaddress  IN Login_Logs.ipaddress%TYPE
    )IS 
        v_id Users.id%TYPE;
    BEGIN
        v_id:= fn_check_login(p_email, p_password_hash);
        IF v_id IS NOT NULL THEN
            pkg_session.g_id_user:=v_id;
            prc_register_login_attempt(p_email, 1, p_ipaddress, v_id);
        ELSE
            prc_register_login_attempt(p_email, 0, p_ipaddress, NULL);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN 
            RAISE_APPLICATION_ERROR(-20002, SQLERRM);
    END prc_login;

  
    
    PROCEDURE prc_change_pass(
        p_id_user IN Users.id%TYPE,
        p_password_hash IN Users.password_hash%TYPE
    )IS
    BEGIN
        UPDATE Users
        SET password_hash = p_password_hash
        WHERE id = p_id_user;
        COMMIT;
    END prc_change_pass;
END pkg_auth;