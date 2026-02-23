CREATE OR REPLACE PACKAGE pkg_inventory IS 

    PROCEDURE prc_restock(
        p_id_prod IN Inventory.id_product%TYPE,
        p_id_ware IN Inventory.id_warehouse%TYPE,
        p_qty     IN Inventory.quantity%TYPE,
        p_id_user IN Users.id%TYPE
    );

    PROCEDURE prc_dispatch(
        p_id_prod IN Inventory.id_product%TYPE,
        p_id_ware IN Inventory.id_warehouse%TYPE,
        p_qty     IN Inventory.quantity%TYPE,
        p_id_user IN Users.id%TYPE
    );

    PROCEDURE prc_add_product(
        p_name       IN Products.name%TYPE,
        p_price_buy  IN Products.price_buy%TYPE,
        p_price_sell IN Products.price_sell%TYPE,
        p_desc       IN Products.description%TYPE,
        p_id_sup     IN Products.id_supplier%TYPE,
        p_id_user    IN Users.id%TYPE
    );

END pkg_inventory;
/

CREATE OR REPLACE PACKAGE BODY pkg_inventory IS

    -- ==========================================
    -- 1. PRZYJMOWANIE TOWARU (UPSERT)
    -- ==========================================
    PROCEDURE prc_restock(
        p_id_prod IN Inventory.id_product%TYPE,
        p_id_ware IN Inventory.id_warehouse%TYPE,
        p_qty     IN Inventory.quantity%TYPE,
        p_id_user IN Users.id%TYPE
    ) IS
        v_qty_before NUMBER;
    BEGIN
        pkg_session.g_id_user := p_id_user;
        BEGIN
            SELECT quantity INTO v_qty_before
            FROM Inventory 
            WHERE id_product = p_id_prod AND id_warehouse = p_id_ware
            FOR UPDATE;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                v_qty_before := 0; 
        END;

        MERGE INTO Inventory i
        USING dual 
        ON (i.id_product = p_id_prod AND i.id_warehouse = p_id_ware)
        WHEN MATCHED THEN
            UPDATE SET i.quantity = i.quantity + p_qty 
        WHEN NOT MATCHED THEN
            INSERT (id_product, id_warehouse, quantity) 
            VALUES (p_id_prod, p_id_ware, p_qty);
            
        INSERT INTO Inventory_Logs (type, quantity, quantity_after, id_warehouse, id_product, id_user)
        VALUES ('ADD', p_qty, v_qty_before + p_qty, p_id_ware, p_id_prod, p_id_user);

        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20001, SQLERRM);
    END prc_restock;

    PROCEDURE prc_dispatch(
        p_id_prod IN Inventory.id_product%TYPE,
        p_id_ware IN Inventory.id_warehouse%TYPE,
        p_qty     IN Inventory.quantity%TYPE,
        p_id_user IN Users.id%TYPE
    ) IS 
        v_qty_before NUMBER;
    BEGIN
        pkg_session.g_id_user := p_id_user;
        SELECT quantity INTO v_qty_before 
        FROM Inventory 
        WHERE id_product = p_id_prod AND id_warehouse = p_id_ware
        FOR UPDATE;

        UPDATE Inventory 
        SET quantity = quantity - p_qty
        WHERE id_product = p_id_prod
          AND id_warehouse = p_id_ware
          AND quantity >= p_qty;
          
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20002,'Brak wystarczającej ilości towaru na stanie');
        END IF;

        INSERT INTO Inventory_Logs (type, quantity, quantity_after, id_warehouse, id_product, id_user)
        VALUES ('REMOVE', p_qty, v_qty_before - p_qty, p_id_ware, p_id_prod, p_id_user);

        COMMIT;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, 'Produkt nie istnieje w tym magazynie');
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20001, SQLERRM);
    END prc_dispatch;    

    PROCEDURE prc_add_product(
        p_name       IN Products.name%TYPE,
        p_price_buy  IN Products.price_buy%TYPE,
        p_price_sell IN Products.price_sell%TYPE,
        p_desc       IN Products.description%TYPE,
        p_id_sup     IN Products.id_supplier%TYPE,
        p_id_user    IN Users.id%TYPE
    ) IS 
        v_new_id NUMBER;
    BEGIN
        pkg_session.g_id_user := p_id_user;
        INSERT INTO Products(name, price_buy, price_sell, description, id_supplier)
        VALUES (p_name, p_price_buy, p_price_sell, p_desc, p_id_sup)
        RETURNING id INTO v_new_id;

        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20001, SQLERRM);
    END prc_add_product;

END pkg_inventory;
/