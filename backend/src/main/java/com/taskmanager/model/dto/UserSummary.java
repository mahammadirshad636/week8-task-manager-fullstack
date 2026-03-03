package com.taskmanager.model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSummary {
    private Long id;
    private String name;
    private String email;
}
