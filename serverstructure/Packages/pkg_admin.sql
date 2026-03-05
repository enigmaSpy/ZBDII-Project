CREATE OR REPLACE PACKAGE pkg_admin IS 
    PROCEDURE prc_is_admin(
        p_id_user IN Users.id%TYPE
    );
    PROCEDURE prc_add_warehouse(
        p_name IN Warehouses.name%TYPE,
        p_street IN Warehouses.street%TYPE,
        p_city IN Warehouses.city%TYPE,
        p_country IN Warehouses.country%TYPE,
        p_executor_id IN Users.id%TYPE
    );
    PROCEDURE prc_create_user(
        p_role IN Users.role%TYPE,
        p_name IN Users.name%TYPE,
        p_email IN Users.email%TYPE,
        p_password_hash IN Users.password_hash%TYPE,
        p_id_user IN Users.id%TYPE
    );
    PROCEDURE prc_toggle_user(
    p_target_id IN Users.id%TYPE,    
    p_executor_id IN Users.id%TYPE   
);
END pkg_admin;
/
CREATE OR REPLACE PACKAGE BODY pkg_admin IS

    PROCEDURE prc_is_admin(
        p_id_user IN Users.id%TYPE
    )
    IS
        v_user_role Users.role%TYPE;
    BEGIN
        SELECT role 
        INTO v_user_role
        FROM Users
        WHERE id = p_id_user;

        IF v_user_role != 'ADMIN' THEN
            RAISE_APPLICATION_ERROR(-20003, 'Odmowa dostępu: Wymagane uprawnienia ADMIN.');
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20005,'Nieprawidłowy użytkownik');
    END prc_is_admin;

    PROCEDURE prc_add_warehouse(
        p_name IN Warehouses.name%TYPE,
        p_street IN  Warehouses.street%TYPE,
        p_city IN Warehouses.city%TYPE,
        p_country IN Warehouses.country%TYPE,
        p_executor_id IN Users.id%TYPE
    )IS
    BEGIN
        prc_is_admin(p_executor_id);
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
        prc_is_admin(p_id_user);
        pkg_session.g_id_user := p_id_user;
        INSERT INTO Users(role, name, email, password_hash)
        VALUES (p_role, p_name, p_email, p_password_hash);
        COMMIT;
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX  THEN
            RAISE_APPLICATION_ERROR(-20001, 'Użytkownik o podanym mailu istneie w bazie');
    END prc_create_user;


    PROCEDURE prc_toggle_user(
    p_target_id IN Users.id%TYPE,    
    p_executor_id IN Users.id%TYPE   
) IS
BEGIN
    prc_is_admin(p_executor_id);

    UPDATE Users 
    SET is_active = 1 - is_active
    WHERE id = p_target_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'Cel o podanym ID nie istnieje w bazie.');
    END IF;

    COMMIT;
END prc_toggle_user;
END pkg_admin;
/