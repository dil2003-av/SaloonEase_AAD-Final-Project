package com.assignment.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String duration;
    private String imageUrl;
    private LocalDate createdAt;
}
