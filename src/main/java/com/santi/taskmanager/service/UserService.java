package com.santi.taskmanager.service;

import com.santi.taskmanager.model.User;
import com.santi.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.santi.taskmanager.dto.UserDTO;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserDTO login(String email, String password) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return new UserDTO(user.getId(), user.getEmail());
    }

    public UserDTO register(String email, String password) {

        if (repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = repository.save(new User(email, password));
        return new UserDTO(user.getId(), user.getEmail());
    }
}