package com.guvi.procurement.dto;

import com.guvi.procurement.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Role role;
    private LocalDateTime createdAt;
}
