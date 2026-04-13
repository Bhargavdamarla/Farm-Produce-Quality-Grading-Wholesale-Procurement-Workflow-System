package com.guvi.procurement.dto;

import com.guvi.procurement.models.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
    private Role role;
}
