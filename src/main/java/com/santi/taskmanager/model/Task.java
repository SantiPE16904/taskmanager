package com.santi.taskmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.santi.taskmanager.model.User;

@Entity
public class Task {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDateTime createdAt;

    public Task() {
        this.status = TaskStatus.PENDING;
    }

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    public Task(String title) {
        this.title = title;
        this.status = TaskStatus.PENDING;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}