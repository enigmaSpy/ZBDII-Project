package com.zbdii.inventory_api.record;

public record UserResponse(Long id,
                           String name,
                           String email,
                           Integer isActive) {

}
