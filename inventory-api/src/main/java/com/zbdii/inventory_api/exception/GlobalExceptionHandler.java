package com.zbdii.inventory_api.exception;

import com.zbdii.inventory_api.record.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleAllExceptions(Exception ex){
        String errorMessage = ex.getMessage();
        if(errorMessage.contains("ORA-20001")){
            errorMessage = "Brak wystarczającej ilości towaru na stanie";
        }
        if(errorMessage.contains("ORA-20004")){
            errorMessage = "BNiepoprawne dane";
        }
        ApiErrorResponse responseBox = new ApiErrorResponse(400, errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBox);
    }
}
