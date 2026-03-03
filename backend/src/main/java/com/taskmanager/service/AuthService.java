package com.taskmanager.service;

import com.taskmanager.exception.BadRequestException;
import com.taskmanager.model.dto.AuthDtos;
import com.taskmanager.model.dto.UserSummary;
import com.taskmanager.model.entity.RefreshToken;
import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.Role;
import com.taskmanager.repository.RefreshTokenRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);

        return issueTokens(user);
    }

    @Transactional
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        return issueTokens(user);
    }

    @Transactional
    public AuthDtos.AuthResponse refresh(AuthDtos.RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (!jwtTokenProvider.validateToken(storedToken.getToken())) {
            refreshTokenRepository.delete(storedToken);
            throw new BadRequestException("Refresh token has expired");
        }

        return issueTokens(storedToken.getUser());
    }

    @Transactional
    public void logout(AuthDtos.RefreshTokenRequest request) {
        refreshTokenRepository.deleteByToken(request.getRefreshToken());
    }

    private AuthDtos.AuthResponse issueTokens(User user) {
        refreshTokenRepository.deleteByUser_Id(user.getId());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(refreshTokenValue);
        refreshToken.setExpiresAt(jwtTokenProvider.getExpiration(refreshTokenValue));
        refreshToken.setUser(user);
        refreshTokenRepository.save(refreshToken);

        return AuthDtos.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .user(UserSummary.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .build())
                .build();
    }
}
