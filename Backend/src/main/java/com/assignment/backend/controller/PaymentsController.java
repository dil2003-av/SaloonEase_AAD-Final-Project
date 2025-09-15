package com.assignment.backend.controller;

import com.assignment.backend.dto.PaymentsDTO;
import com.assignment.backend.entity.Payments;
import com.assignment.backend.service.PaymentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PaymentsController {

    private final PaymentsService paymentsService;

    @PostMapping("/create")
    public ResponseEntity<PaymentsDTO> createPayment(@RequestBody PaymentsDTO paymentsDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentsService.createPayment(paymentsDTO));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentsDTO> getPaymentById(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentsService.getPaymentById(paymentId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<PaymentsDTO> getPaymentByAppointmentId(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(paymentsService.getPaymentByAppointmentId(appointmentId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PaymentsDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentsService.getAllPayments());
    }

    @PutMapping("/update-status/{paymentId}")
    public ResponseEntity<PaymentsDTO> updatePaymentStatus(@PathVariable Long paymentId,
                                                           @RequestParam String status) {
        return ResponseEntity.ok(paymentsService.updatePaymentStatus(paymentId, status));
    }

//    @PostMapping("/create-payhere/{appointmentId}")
//    public ResponseEntity<?> createPayHereForm(@PathVariable Long appointmentId) {
//        try {
//            return ResponseEntity.ok(paymentsService.createPayHereFormData(appointmentId));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Failed to create payment form", "message", e.getMessage()));
//        }
//    }

    @PostMapping("/create-payhere/{appointmentId}")
    public ResponseEntity<?> createPayHereForm(@PathVariable Long appointmentId) {
        try {
            return ResponseEntity.ok(paymentsService.createPayHereFormData(appointmentId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create payment form", "message", e.getMessage()));
        }
    }

//    @PostMapping("/notify")
//    public ResponseEntity<String> handlePayHereNotification(@RequestParam Map<String, String> params) {
//        paymentsService.updatePaymentFromPayHere(params);
//        return ResponseEntity.ok("OK");
//    }

    @PostMapping("/notify")
    public ResponseEntity<String> handlePayHereNotification(@RequestParam Map<String, String> params) {
        paymentsService.updatePaymentFromPayHere(params);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/test-hash/{appointmentId}")
    public ResponseEntity<Map<String, String>> testHash(@PathVariable Long appointmentId) {
        try {
            Map<String, Object> data = paymentsService.createPayHereFormData(appointmentId);
            return ResponseEntity.ok(Map.of(
                    "merchant_id", data.get("merchant_id").toString(),
                    "order_id", data.get("order_id").toString(),
                    "amount", data.get("amount").toString(),
                    "currency", data.get("currency").toString(),
                    "hash", data.get("hash").toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
