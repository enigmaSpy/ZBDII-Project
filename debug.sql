ALTER TRIGGER ZIIBD6.DROP_TAB_TRIG DISABLE;
DROP TABLE Product_Logs CASCADE CONSTRAINTS;
DROP SEQUENCE seq_product_logs;

CREATE TABLE Product_Logs(
    id NUMBER PRIMARY KEY,
    field_name VARCHAR2(12) CHECK (field_name IN ('price_buy', 'price_sell', 'description', 'name', 'is_active', 'id_supplier')) NOT NULL,
    old_value VARCHAR2(4000),
    new_value VARCHAR2(4000),
    reason VARCHAR2(255),
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_product NUMBER REFERENCES Products(id),
    id_user NUMBER REFERENCES Users(id)
);

CREATE SEQUENCE seq_product_logs START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER tgr_product_logs_id 
BEFORE INSERT ON Product_Logs
FOR EACH ROW
BEGIN
    :NEW.id := seq_product_logs.NEXTVAL;
END;
/