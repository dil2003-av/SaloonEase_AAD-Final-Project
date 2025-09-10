package com.assignment.backend.dto;

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
    private String userEmail;       // foreign key reference to User
    private String serviceName;    // foreign key reference to Service
    private Double price;
    private String bookingDate;
    private String appointmentTime;
    private String status;
    private String notes;
}
