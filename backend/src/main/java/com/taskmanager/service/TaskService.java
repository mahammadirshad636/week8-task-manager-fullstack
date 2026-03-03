package com.taskmanager.service;

import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.NotFoundException;
import com.taskmanager.model.dto.TaskDtos;
import com.taskmanager.model.dto.UserSummary;
import com.taskmanager.model.entity.Task;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    @Transactional(readOnly = true)
    public Page<TaskDtos.TaskResponse> getTasks(String status, String priority, Long assigneeId, Pageable pageable) {
        Page<Task> tasks;

        if (status != null && priority != null) {
            tasks = taskRepository.findByStatusAndPriority(parseStatus(status), parsePriority(priority), pageable);
        } else if (status != null) {
            tasks = taskRepository.findByStatus(parseStatus(status), pageable);
        } else if (priority != null) {
            tasks = taskRepository.findByPriority(parsePriority(priority), pageable);
        } else if (assigneeId != null) {
            tasks = taskRepository.findByAssigneeId(assigneeId, pageable);
        } else {
            tasks = taskRepository.findAll(pageable);
        }

        return tasks.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskDtos.TaskResponse getTask(Long id) {
        return toResponse(findTask(id));
    }

    @Transactional
    public TaskDtos.TaskResponse createTask(TaskDtos.CreateTaskRequest request, User currentUser) {
        Task task = new Task();
        applyTask(task, request.getTitle(), request.getDescription(), request.getStatus(), request.getPriority(),
                request.getDueDate(), request.getAssigneeId());
        task.setCreatedBy(currentUser);
        Task saved = taskRepository.save(task);
        TaskDtos.TaskResponse response = toResponse(saved);
        webSocketService.sendTaskUpdate("TASK_CREATED", response);
        return response;
    }

    @Transactional
    public TaskDtos.TaskResponse updateTask(Long id, TaskDtos.UpdateTaskRequest request) {
        Task task = findTask(id);
        applyTask(task, request.getTitle(), request.getDescription(), request.getStatus(), request.getPriority(),
                request.getDueDate(), request.getAssigneeId());
        TaskDtos.TaskResponse response = toResponse(taskRepository.save(task));
        webSocketService.sendTaskUpdate("TASK_UPDATED", response);
        return response;
    }

    @Transactional
    public TaskDtos.TaskResponse updateTaskStatus(Long id, TaskDtos.UpdateTaskStatusRequest request) {
        if (request.getStatus() == null) {
            throw new BadRequestException("Status is required");
        }
        Task task = findTask(id);
        task.setStatus(request.getStatus());
        TaskDtos.TaskResponse response = toResponse(taskRepository.save(task));
        webSocketService.sendTaskUpdate("TASK_STATUS_CHANGED", response);
        return response;
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = findTask(id);
        taskRepository.delete(task);
        webSocketService.sendTaskUpdate("TASK_DELETED", id);
    }

    private void applyTask(Task task,
                           String title,
                           String description,
                           TaskStatus status,
                           TaskPriority priority,
                           java.time.LocalDate dueDate,
                           Long assigneeId) {
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status == null ? TaskStatus.TODO : status);
        task.setPriority(priority == null ? TaskPriority.MEDIUM : priority);
        task.setDueDate(dueDate);
        task.setAssignee(assigneeId == null ? null : userRepository.findById(assigneeId)
                .orElseThrow(() -> new NotFoundException("Assignee not found")));
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
    }

    private TaskStatus parseStatus(String value) {
        try {
            return TaskStatus.valueOf(value.toUpperCase());
        } catch (Exception exception) {
            throw new BadRequestException("Invalid status: " + value);
        }
    }

    private TaskPriority parsePriority(String value) {
        try {
            return TaskPriority.valueOf(value.toUpperCase());
        } catch (Exception exception) {
            throw new BadRequestException("Invalid priority: " + value);
        }
    }

    private TaskDtos.TaskResponse toResponse(Task task) {
        return TaskDtos.TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assignee(toSummary(task.getAssignee()))
                .createdBy(toSummary(task.getCreatedBy()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private UserSummary toSummary(User user) {
        if (user == null) {
            return null;
        }
        return UserSummary.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
