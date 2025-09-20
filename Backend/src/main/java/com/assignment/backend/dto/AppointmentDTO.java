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
public class AppointmentDTO {

    private Long id;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    private String userEmail;       // foreign key reference to User

    @NotBlank(message = "Service name is required")
    private String serviceName;    // foreign key reference to Service

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private Double price;

    @NotBlank(message = "Booking date is required")
    // Example pattern: yyyy-MM-dd
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Booking date must be in format yyyy-MM-dd")
    private String bookingDate;

    @NotBlank(message = "Appointment time is required")
    // Example pattern: HH:mm (24-hour format)
    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Appointment time must be in format HH:mm")
    private String appointmentTime;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Pending|Approved|Declined|Completed|Cancelled)$",
            message = "Status must be one of: Pending, Approved, Declined, Completed, Cancelled")
    private String status;

    @Size(max = 255, message = "Notes cannot exceed 255 characters")
    private String notes;
}
