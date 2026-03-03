package com.taskmanager.controller;

import com.taskmanager.model.dto.TaskDtos;
import com.taskmanager.model.entity.User;
import com.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<Page<TaskDtos.TaskResponse>> getTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(taskService.getTasks(status, priority, assigneeId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDtos.TaskResponse> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTask(id));
    }

    @PostMapping
    public ResponseEntity<TaskDtos.TaskResponse> createTask(
            @Valid @RequestBody TaskDtos.CreateTaskRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDtos.TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDtos.UpdateTaskRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskDtos.TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody TaskDtos.UpdateTaskStatusRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
