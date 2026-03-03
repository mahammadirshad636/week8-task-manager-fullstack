package com.taskmanager.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public final class AuthDtos {

    private AuthDtos() {
    }

    @Getter
    @Setter
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Getter
    @Setter
    public static class RegisterRequest {
        @NotBlank
        private String name;

        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 8)
        private String password;
    }

    @Getter
    @Setter
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }

    @Getter
    @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private UserSummary user;
    }
}
