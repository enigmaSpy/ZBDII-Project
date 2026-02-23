CREATE OR REPLACE PACKAGE pkg_admin IS 
    PROCEDURE prc_add_warehouse;
    PROCEDURE prc_create_user;
    PROCEDURE prc_toggle_user;
END pkg_inventory;
--//TODO: Package Body