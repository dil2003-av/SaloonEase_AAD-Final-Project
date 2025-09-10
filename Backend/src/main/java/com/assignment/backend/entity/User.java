package com.assignment.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;  // DB walata save wenna

    private String email;

    private String password;

    @Transient // DB walata save karanna epa
    private String confirmPassword;

    @Enumerated(EnumType.STRING)
    private Role role;
}

