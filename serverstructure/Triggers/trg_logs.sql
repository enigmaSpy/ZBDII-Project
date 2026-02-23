CREATE OR REPLACE TRIGGER tgr_product_logs
AFTER INSERT OR UPDATE ON Products
FOR EACH ROW
BEGIN

    IF INSERTING THEN
        INSERT INTO Product_Logs(field_name, old_value, new_value, reason, id_product, id_user)
        VALUES('name', NULL, :NEW.name, 'Utworzenie nowego produktu', :NEW.id, pkg_session.g_id_user);
    END IF;

    IF UPDATING THEN
        IF :OLD.name != :NEW.name THEN
            INSERT INTO Product_Logs(field_name, old_value, new_value, reason, id_product, id_user)
            VALUES('name', :OLD.name, :NEW.name, 'Zmiana nazwy', :NEW.id, pkg_session.g_id_user);
        END IF;

        IF :OLD.price_sell != :NEW.price_sell THEN
            INSERT INTO Product_Logs(field_name, old_value, new_value, reason, id_product, id_user)
            VALUES('price_sell', TO_CHAR(:OLD.price_sell), TO_CHAR(:NEW.price_sell), 'Zmiana ceny sprzedaży', :NEW.id, pkg_session.g_id_user);
        END IF;

        IF :OLD.price_buy != :NEW.price_buy THEN
            INSERT INTO Product_Logs(field_name, old_value, new_value, reason, id_product, id_user)
            VALUES('price_buy', TO_CHAR(:OLD.price_buy), TO_CHAR(:NEW.price_buy), 'Zmiana ceny zakupu', :NEW.id, pkg_session.g_id_user);
        END IF;

        IF :OLD.id_supplier != :NEW.id_supplier THEN
            INSERT INTO Product_Logs(field_name, old_value, new_value, reason, id_product, id_user)
            VALUES('id_supplier', TO_CHAR(:OLD.id_supplier), TO_CHAR(:NEW.id_supplier), 'Zmiana dostawcy', :NEW.id, pkg_session.g_id_user);
        END IF;

        IF :OLD.is_active != :NEW.is_active THEN
            INSERT INTO Product_Logs(field_name, old_value, new_value, reason, id_product, id_user)
            VALUES('is_active', TO_CHAR(:OLD.is_active), TO_CHAR(:NEW.is_active), 'Zmiana statusu aktywności', :NEW.id, pkg_session.g_id_user);
        END IF;
        
    END IF;
END;
/