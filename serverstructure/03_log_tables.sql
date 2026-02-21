CREATE TABLE Inventory_Logs(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('ADD', 'REMOVE', 'CORRECTION')) NOT NULL,
    quantity NUMBER NOT NULL CHECK (quantity > 0),
    quantity_after NUMBER NOT NULL,
    historical_price_buy NUMBER(10,2),
    historical_price_sell NUMBER(10,2),
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_warehouse NUMBER REFERENCES Warehouses(id),
    id_product NUMBER REFERENCES Products(id),
    id_user NUMBER REFERENCES Users(id)
)

CREATE TABLE Product_Logs(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    field_name VARCHAR2(12) CHECK (field_name IN ('price_buy', 'price_sell', 'description', 'name', 'is_active', 'id_supplier')) NOT NULL,
    old_value VARCHAR2(4000),
    new_value VARCHAR2(4000),
    reason VARCHAR2(255),
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_product NUMBER REFERENCES Products(id),
    id_user NUMBER REFERENCES Users(id)
)

CREATE TABLE Login_Logs (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    is_success NUMBER(1) CHECK (is_success IN (0,1)) NOT NULL,
    email_attempted VARCHAR2(255) NOT NULL,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ipaddress VARCHAR2(45),
    id_user NUMBER REFERENCES Users(id) ON DELETE SET NULL
);