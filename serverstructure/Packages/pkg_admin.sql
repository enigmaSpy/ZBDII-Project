CREATE OR REPLACE PACKAGE pkg_admin IS 
    PROCEDURE prc_add_warehouse(
        p_name IN Warehouses.name%TYPE,
        p_street IN Warehouses.street%TYPE,
        p_city IN Warehouses.city%TYPE,
        p_country IN Warehouses.country%TYPE
    );
    PROCEDURE prc_create_user(
        p_role IN Users.role%TYPE,
        name IN Users.name%TYPE,
        email IN Users.email%TYPE,
        password_hash IN Users.password_hash%TYPE,
        p_id_user IN Users.id%TYPE
    );
    PROCEDURE prc_toggle_user(
        p_id_user IN Users.id_user%TYPE
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
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX  THEN
            RAISE_APPLICATION_ERROR(-20001, 'Użytkownik o podanym mailu istneie w bazie');
    END prc_create_user;


    PROCEDURE prc_toggle_user(
        p_id_user IN Users.id_user%TYPE
    )IS
        v_is_active Users.is_active%TYPE;
    BEGIN
        SELECT is_active 
        INTO v_is_active
        FROM Users
        WHERE id = p_id_user;

        
        UPDATE Users 
        SET is_active = 1 - is_active
        WHERE id = p_id_user;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR('Użytkownik nie istnieje');
    END prc_toggle_user;
END pkg_admin;






