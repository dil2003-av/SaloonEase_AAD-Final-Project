package com.assignment.backend.dto;

import com.assignment.backend.entity.Role;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    private String email;
    private String username;
    private String password;
    private String confirmPassword;
    private String role;//USER or ADMIN

}
