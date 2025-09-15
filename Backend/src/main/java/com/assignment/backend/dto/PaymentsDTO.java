//package com.assignment.backend.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class PaymentsDTO {
//
//    private Long paymentId;
//
//    // appointment reference by ID
//    private Long appointmentId;
//
//    private BigDecimal amount;
//
//    private LocalDateTime paymentDate;
//
//    private String paymentMethod; // PAYHERE, CREDIT_CARD, CASH, etc.
//
//    private String transactionId;
//
//    private String status; // PENDING, COMPLETED, FAILED
//}
package com.assignment.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentsDTO {
    private Long paymentId;
    private Long appointmentId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String transactionId;
    private String status;
}
