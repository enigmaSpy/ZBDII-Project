CREATE OR REPLACE VIEW v_warehouse_summary AS
SELECT
    w.id AS warehouse_id,
    w.name AS warehouse_name,
    NVL(SUM(i.quantity), 0) AS total_items,
    NVL(SUM(i.quantity* p.price_buy), 0) AS total_value
FROM Warehouses w 
LEFT JOIN Inventory i ON w.id = i.id_warehouse
LEFT JOIN Products p ON i.id_product = p.id
GROUP BY w.id, w.name;
COMMIT;