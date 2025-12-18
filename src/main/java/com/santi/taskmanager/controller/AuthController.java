package com.santi.taskmanager.controller;

import com.santi.taskmanager.dto.LoginRequest;
import com.santi.taskmanager.dto.RegisterRequest;
import com.santi.taskmanager.dto.UserDTO;
import com.santi.taskmanager.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody LoginRequest request) {
        return service.login(
                request.getEmail(),
                request.getPassword()
        );
    }

    @PostMapping("/register")
    public UserDTO register(@RequestBody RegisterRequest request) {
        return service.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );
    }
}