package com.santi.taskmanager.dto;

public class UserDTO {

    private Long id;
    private String email;
    private String username;

    public UserDTO(Long id, String email, String username) {
        this.id = id;
        this.email = email;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}