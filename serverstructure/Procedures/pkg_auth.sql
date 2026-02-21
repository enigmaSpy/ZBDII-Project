CREATE OR REPLACE PACKAGE pkg_auth IS 
    FUNCTION fn_check_login;
    PROCEDURE prc_register_login_attempt;
    PROCEDURE prc_change_pass;
END pkg_auth;
--//TODO: Package Body