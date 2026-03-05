package com.zbdii.inventory_api.controller;
import com.zbdii.inventory_api.record.CreateUserRecord;
import com.zbdii.inventory_api.record.GetUser;
import com.zbdii.inventory_api.record.UserResponse;
import com.zbdii.inventory_api.service.UserService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }
    @PostMapping
    public String addUser(
            @RequestBody CreateUserRecord record,
            @RequestParam Long executorId
            ){
        userService.addUser(record, executorId);
        return "Utworzono nowego użytkownika w bazie: " + record.name();
    }

    @PostMapping("/{id}/toggle")
    public String toggleUser(
            @PathVariable Long id,
            @RequestParam Long executorId
    ){
        return userService.toggleUser(id, executorId);
    }

    @GetMapping("/{id}")
    public  UserResponse getUser(@PathVariable Long id){
        return userService.getUser(id);
    }
}
