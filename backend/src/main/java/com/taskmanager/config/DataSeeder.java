package com.taskmanager.config;

import com.taskmanager.model.entity.User;
import com.taskmanager.model.enums.Role;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.name:Demo User}")
    private String seedName;

    @Value("${app.seed.email:user@example.com}")
    private String seedEmail;

    @Value("${app.seed.password:password123}")
    private String seedPassword;

    @Override
    public void run(String... args) {
        if (!seedEnabled || userRepository.existsByEmail(seedEmail)) {
            return;
        }

        User user = new User();
        user.setName(seedName);
        user.setEmail(seedEmail);
        user.setPassword(passwordEncoder.encode(seedPassword));
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);
    }
}
