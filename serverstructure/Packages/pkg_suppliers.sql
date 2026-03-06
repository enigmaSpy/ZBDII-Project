CREATE OR REPLACE PACKAGE pkg_suppliers IS
    PROCEDURE prc_add_supplier(
    p_name        IN Suppliers.name%TYPE,
    p_street      IN Suppliers.street%TYPE,
    p_city        IN Suppliers.city%TYPE,
    p_country     IN Suppliers.country%TYPE,
    p_email       IN Suppliers.email%TYPE,
    p_phone       IN Suppliers.phone%TYPE,
    p_executor_id IN Users.id%TYPE
);
END pkg_suppliers;
/
CREATE OR REPLACE PACKAGE BODY pkg_suppliers IS
    PROCEDURE prc_add_supplier(
    p_name      IN Suppliers.name%TYPE,
    p_street    IN Suppliers.street%TYPE,
    p_city      IN Suppliers.city%TYPE,
    p_country   IN Suppliers.country%TYPE,
    p_email     IN Suppliers.email%TYPE,
    p_phone     IN Suppliers.phone%TYPE,
    p_executor_id IN Users.id%TYPE
) IS
BEGIN
    pkg_admin.prc_is_admin(p_executor_id);

    INSERT INTO Suppliers(name, street, city, country, email, phone)
    VALUES (p_name, p_street, p_city, p_country, p_email, p_phone);

    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20006, 'Dostawca o podanym emailu już istnieje w bazie');
END prc_add_supplier;
END pkg_suppliers;
/
