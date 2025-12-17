package com.santi.taskmanager.service;

import com.santi.taskmanager.model.Task;
import com.santi.taskmanager.model.TaskStatus;
import com.santi.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> findAll() {
        return repository.findAll();
    }

    public Task save(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        return repository.save(task);
    }


    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Task findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
}