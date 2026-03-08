CREATE OR REPLACE VIEW v_product_desc AS
 SELECT p.id, p.name, p.price_buy, p.price_sell, p.description,
               p.is_active, p.id_supplier, s.name AS supplier_name
        FROM Products p
        LEFT JOIN Suppliers s ON p.id_supplier = s.id ORDER BY p.id;
