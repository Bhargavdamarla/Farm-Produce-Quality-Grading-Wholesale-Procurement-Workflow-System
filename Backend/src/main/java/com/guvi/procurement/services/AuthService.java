package com.guvi.procurement.services;

import com.guvi.procurement.dto.AuthResponse;
import com.guvi.procurement.dto.LoginRequest;
import com.guvi.procurement.dto.RegisterRequest;
import com.guvi.procurement.models.User;
import com.guvi.procurement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private boolean isValidGmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9._%+-]+@gmail\\.com$");
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && phoneNumber.matches("^\\d{10}$");
    }

    public AuthResponse register(RegisterRequest request) {
        if (!isValidGmail(request.getEmail())) {
            throw new RuntimeException("Email must be a valid @gmail.com address.");
        }

        if (!isValidPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number must be exactly 10 digits.");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered. Please login instead.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password. Please try again.");
        }

        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
