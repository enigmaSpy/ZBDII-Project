CREATE OR REPLACE PACKAGE pkg_admin IS 
    PROCEDURE prc_add_warehouse(
        p_name IN Warehouses.name%TYPE,
        p_street IN Warehouses.street%TYPE,
        p_city IN Warehouses.city%TYPE,
        p_country IN Warehouses.country%TYPE
    );
    PROCEDURE prc_create_user(
        p_role IN Users.role%TYPE,
        p_name IN Users.name%TYPE,
        p_email IN Users.email%TYPE,
        p_password_hash IN Users.password_hash%TYPE,
        p_id_user IN Users.id%TYPE
    );
    PROCEDURE prc_toggle_user(
        p_id_user IN Users.id%TYPE
    );
END pkg_admin;

CREATE OR REPLACE PACKAGE BODY pkg_admin IS

    PROCEDURE prc_add_warehouse(
        p_name IN Warehouses.name%TYPE,
        p_street IN  Warehouses.street%TYPE,
        p_city IN Warehouses.city%TYPE,
        p_country IN Warehouses.country%TYPE
    )IS
    BEGIN
        INSERT INTO Warehouses(name, street, city, country)
        VALUES (p_name, p_street, p_city, p_country);
        COMMIT;
    END prc_add_warehouse;


    PROCEDURE prc_create_user(
        p_role IN Users.role%TYPE,
        p_name IN Users.name%TYPE,
        p_email IN Users.email%TYPE,
        p_password_hash IN Users.password_hash%TYPE,
        p_id_user IN Users.id%TYPE
    )IS
    BEGIN
        pkg_session.g_id_user := p_id_user;
        INSERT INTO Users(role, name, email, password_hash)
        VALUES (p_role, p_name, p_email, p_password_hash);
        COMMIT;
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX  THEN
            RAISE_APPLICATION_ERROR(-20001, 'Użytkownik o podanym mailu istneie w bazie');
    END prc_create_user;


    PROCEDURE prc_toggle_user(
        p_id_user IN Users.id%TYPE
    )IS
    BEGIN
        
        UPDATE Users 
        SET is_active = 1 - is_active
        WHERE id = p_id_user 
        AND is_active = 1;
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20002, 'Użytkownik nie istnieje');
        END IF;
        COMMIT;
    END prc_toggle_user;
END pkg_admin;
/