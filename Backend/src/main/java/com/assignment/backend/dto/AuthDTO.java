package com.assignment.backend.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AuthDTO {
    private String email;
    private String password;
}
