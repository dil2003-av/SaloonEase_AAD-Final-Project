package com.assignment.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewsDTO {

    private Long id;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    private String userEmail;     // reference to user

    @NotBlank(message = "Service name is required")
    private String serviceName;   // reference to service

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private int rating;

    @NotBlank(message = "Review text is required")
    @Size(max = 500, message = "Review text cannot exceed 500 characters")
    private String reviewText;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Pending|Approved|Declined)$",
            message = "Status must be one of: Pending, Approved, Declined")
    private String status;
}
