package com.taskmanager.model.dto;

import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

public final class TaskDtos {

    private TaskDtos() {
    }

    @Getter
    @Setter
    public static class CreateTaskRequest {
        @NotBlank
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private LocalDate dueDate;
        private Long assigneeId;
    }

    @Getter
    @Setter
    public static class UpdateTaskRequest {
        @NotBlank
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private LocalDate dueDate;
        private Long assigneeId;
    }

    @Getter
    @Setter
    public static class UpdateTaskStatusRequest {
        private TaskStatus status;
    }

    @Getter
    @Builder
    public static class TaskResponse {
        private Long id;
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private LocalDate dueDate;
        private UserSummary assignee;
        private UserSummary createdBy;
        private Instant createdAt;
        private Instant updatedAt;
    }
}
