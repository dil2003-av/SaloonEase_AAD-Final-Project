package com.assignment.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many appointments belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many appointments belong to one service
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String bookingDate; // can use LocalDate

    @Column(nullable = false)
    private String appointmentTime; // can use LocalTime

    @Column(nullable = false)
    private String status;

    @Column(length = 500)
    private String notes;
}
