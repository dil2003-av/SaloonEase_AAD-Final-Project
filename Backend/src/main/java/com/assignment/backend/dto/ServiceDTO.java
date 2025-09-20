package com.assignment.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {

    private Long id;

    @NotBlank(message = "Service name is required")
    @Size(max = 100, message = "Service name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotBlank(message = "Duration is required")
    @Pattern(regexp = "^[0-9]+(min|hr|hrs)$",
            message = "Duration must be in format like '30min', '1hr', '2hrs'")
    private String duration;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private LocalDate createdAt;
}
