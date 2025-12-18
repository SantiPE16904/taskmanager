package com.santi.taskmanager.controller;

import com.santi.taskmanager.model.User;
import com.santi.taskmanager.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.santi.taskmanager.dto.UserDTO;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody User user) {
        return service.login(user.getEmail(), user.getPassword());
    }

    @PostMapping("/register")
    public UserDTO register(@RequestBody User user) {
        return service.register(user.getEmail(), user.getPassword());
    }
}