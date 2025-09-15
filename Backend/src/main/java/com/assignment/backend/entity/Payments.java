//package com.assignment.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "payments")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Payments {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long paymentId;
//
//    // One payment is linked to one appointment
//    @OneToOne
//    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
//    private Appointment appointment;
//
//    @Column(nullable = false)
//    private BigDecimal amount;
//
//    @Column(nullable = false)
//    private LocalDateTime paymentDate;
//
//    @Column(length = 50)
//    private String paymentMethod; // e.g., PAYHERE, CREDIT_CARD, CASH
//
//    @Column(length = 100)
//    private String transactionId;
//
//    @Column(length = 20)
//    private String status; // PENDING, COMPLETED, FAILED
//}
package com.assignment.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Column(length = 50)
    private String paymentMethod; // e.g., PAYHERE

    @Column(length = 100)
    private String transactionId;

    @Column(length = 20)
    private String status; // PENDING, COMPLETED, FAILED
}
