CREATE TABLE Products(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    price_buy NUMBER(10, 2) NOT NULL,
    price_sell NUMBER(10, 2) NOT NULL,
    description VARCHAR2(2000),
    is_active NUMBER(1) DEFAULT 1 CHECK(is_active IN (0,1)) NOT NULL,
    id_supplier NUMBER REFERENCES Suppliers(id)
);

CREATE TABLE Inventory(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quantity NUMBER DEFAULT 0 NOT NULL,
    id_product NUMBER REFERENCES Products(id) ON DELETE CASCADE,
    id_warehouse NUMBER REFERENCES Warehouses(id) ON DELETE CASCADE,
    CONSTRAINT uq_prod_ware UNIQUE (id_product, id_warehouse)
);