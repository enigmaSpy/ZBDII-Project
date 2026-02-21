CREATE OR REPLACE PACKAGE pkg_inventory IS 
    PROCEDURE prc_restock(
        p_id_prod IN Inventory.id_product%TYPE,
        p_id_ware IN Inventory.id_warehouse%TYPE,
        p_qty     IN Inventory.quantity%TYPE,
        p_user    IN Users.id%TYPE
    );
    PROCEDURE prc_add_product;
    PROCEDURE prc_dispatch;
END pkg_inventory;

CREATE OR REPLACE PACKAGE BODY pkg_inventory IS

    PROCEDURE prc_restock(
        p_id_prod IN Inventory.id_product%TYPE,
        p_id_ware IN Inventory.id_warehouse%TYPE,
        p_qty     IN Inventory.quantity%TYPE,
        p_user    IN Users.id%TYPE
    ) IS
    BEGIN
        MERGE INTO Inventory i
        USING dual 
        ON (i.id_product = p_id_prod AND i.id_warehouse = p_id_ware)
        
        WHEN MATCHED THEN
            UPDATE SET i.quantity = i.quantity + p_qty 
            
        WHEN NOT MATCHED THEN
            INSERT (id_product, id_warehouse, quantity) 
            VALUES (p_id_prod, p_id_ware, p_qty);
            
        COMMIT; 
    END prc_restock;
--//TODO: Reszta parametrów jutro
END pkg_inventory;
/
