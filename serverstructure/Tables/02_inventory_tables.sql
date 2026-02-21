CREATE TABLE Products(
    id NUMBER PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    price_buy NUMBER(10, 2) NOT NULL,
    price_sell NUMBER(10, 2) NOT NULL,
    description VARCHAR2(2000),
    is_active NUMBER(1) DEFAULT 1 CHECK(is_active IN (0,1)) NOT NULL,
    id_supplier NUMBER REFERENCES Suppliers(id)
);
CREATE SEQUENCE seq_products START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER trg_products_id 
BEFORE INSERT ON Products
FOR EACH ROW 
BEGIN
    :NEW.id :=seq_products.NEXTVAL;
END;
/

CREATE TABLE Inventory(
    id NUMBER PRIMARY KEY,
    quantity NUMBER DEFAULT 0 NOT NULL,
    id_product NUMBER REFERENCES Products(id) ON DELETE CASCADE,
    id_warehouse NUMBER REFERENCES Warehouses(id) ON DELETE CASCADE,
    CONSTRAINT uq_prod_ware UNIQUE (id_product, id_warehouse)
);
CREATE SEQUENCE seq_inventory START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER trg_inventory_id 
BEFORE INSERT ON Inventory
FOR EACH ROW 
BEGIN
    :NEW.id :=seq_inventory.NEXTVAL;
END;
/