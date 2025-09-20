package com.assignment.backend.controller;

import com.assignment.backend.dto.AppointmentDTO;
import com.assignment.backend.dto.PaymentsDTO;
import com.assignment.backend.dto.ServiceDTO;
import com.assignment.backend.service.AppointmentService;
import com.assignment.backend.service.PaymentsService;
import com.assignment.backend.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final AppointmentService appointmentService;
    private final PaymentsService paymentsService;
    private final ServiceService serviceService;

    // Fetch all appointments for admin table
    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Fetch all payments
    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        List<PaymentsDTO> payments = paymentsService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    // Fetch all services
    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        List<ServiceDTO> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }


    // Fetch bill for a specific appointment
    @GetMapping("/bill/{appointmentId}")
    public ResponseEntity<?> getBill(@PathVariable Long appointmentId) {
        AppointmentDTO appointment = appointmentService.getAllAppointments()
                .stream()
                .filter(a -> a.getId().equals(appointmentId))
                .findFirst()
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));
        }

        PaymentsDTO payment = paymentsService.getAllPayments()
                .stream()
                .filter(p -> Objects.equals(p.getAppointmentId(), appointmentId))
                .findFirst()
                .orElse(null);

        ServiceDTO service = serviceService.getAllServices()
                .stream()
                .filter(s -> s.getName().equals(appointment.getServiceName()))
                .findFirst()
                .orElse(null);

        Map<String, Object> bill = new LinkedHashMap<>();
        bill.put("appointmentId", appointment.getId());
        bill.put("customerEmail", appointment.getUserEmail());
        bill.put("serviceName", service != null ? service.getName() : "Unknown");
        bill.put("servicePrice", service != null ? service.getPrice() : 0.0);
        bill.put("appointmentDate", appointment.getBookingDate());
        bill.put("appointmentTime", appointment.getAppointmentTime());
        bill.put("appointmentStatus", appointment.getStatus());

        if (payment != null) {
            bill.put("paymentStatus", payment.getStatus());
            bill.put("paymentMethod", payment.getPaymentMethod());
            bill.put("transactionId", payment.getTransactionId());
            bill.put("paymentDate", payment.getPaymentDate());
        } else {
            bill.put("paymentStatus", "Not Paid");
        }

        return ResponseEntity.ok(bill);
    }
}
