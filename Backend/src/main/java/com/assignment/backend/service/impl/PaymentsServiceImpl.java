////package com.assignment.backend.service.impl;
////
////import com.assignment.backend.dto.PaymentsDTO;
////import com.assignment.backend.entity.Appointment;
////import com.assignment.backend.entity.Payments;
////import com.assignment.backend.repository.AppointmentRepository;
////import com.assignment.backend.repository.PaymentsRepository;
////import com.assignment.backend.service.PaymentsService;
////import lombok.extern.slf4j.Slf4j;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.beans.factory.annotation.Value;
////import org.springframework.http.HttpStatus;
////import org.springframework.stereotype.Service;
////import org.springframework.web.server.ResponseStatusException;
////
////import java.math.BigDecimal;
////import java.nio.charset.StandardCharsets;
////import java.security.MessageDigest;
////import java.time.LocalDateTime;
////import java.util.LinkedHashMap;
////import java.util.List;
////import java.util.Map;
////import java.util.stream.Collectors;
////
////@Slf4j
////@Service
////public class PaymentsServiceImpl implements PaymentsService {
////
////    @Value("${payhere.merchant-id}")
////    private String merchantId;
////
////    @Value("${payhere.merchant-secret}")
////    private String merchantSecret;
////
////    @Value("${app.base-url}")
////    private String appBaseUrl;
////
////    @Autowired
////    private PaymentsRepository paymentsRepository;
////
////    @Autowired
////    private AppointmentRepository appointmentRepository;
////
////    @Override
////    public PaymentsDTO createPayment(PaymentsDTO paymentsDTO) {
////        Appointment appointment = appointmentRepository.findById(paymentsDTO.getAppointmentId())
////                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
////                        "Appointment not found with ID: " + paymentsDTO.getAppointmentId()));
////
////        if (paymentsRepository.findByAppointment_Id(paymentsDTO.getAppointmentId()).isPresent()) {
////            throw new ResponseStatusException(HttpStatus.CONFLICT,
////                    "Payment already exists for appointment ID: " + paymentsDTO.getAppointmentId());
////        }
////
////        Payments payment = new Payments();
////        payment.setAppointment(appointment);
////        payment.setAmount(paymentsDTO.getAmount());
////        payment.setPaymentDate(LocalDateTime.now());
////        payment.setPaymentMethod(paymentsDTO.getPaymentMethod());
////        payment.setTransactionId(paymentsDTO.getTransactionId());
////        payment.setStatus(paymentsDTO.getStatus());
////
////        return convertToDTO(paymentsRepository.save(payment));
////    }
////
////    @Override
////    public PaymentsDTO getPaymentById(Long paymentId) {
////        Payments payment = paymentsRepository.findById(paymentId)
////                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
////                        "Payment not found with ID: " + paymentId));
////        return convertToDTO(payment);
////    }
////
////    @Override
////    public PaymentsDTO getPaymentByAppointmentId(Long appointmentId) {
////        Payments payment = paymentsRepository.findByAppointment_Id(appointmentId)
////                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
////                        "Payment not found for appointment ID: " + appointmentId));
////        return convertToDTO(payment);
////    }
////
////    @Override
////    public List<PaymentsDTO> getAllPayments() {
////        return paymentsRepository.findAll().stream()
////                .map(this::convertToDTO)
////                .collect(Collectors.toList());
////    }
////
////    @Override
////    public PaymentsDTO updatePaymentStatus(Long paymentId, String status) {
////        Payments payment = paymentsRepository.findById(paymentId)
////                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
////                        "Payment not found with ID: " + paymentId));
////        payment.setStatus(status);
////        return convertToDTO(paymentsRepository.save(payment));
////    }
////
////    @Override
////    public Map<String, Object> createPayHereFormData(Long appointmentId) {
////        Appointment appointment = appointmentRepository.findById(appointmentId)
////                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
////
////        String orderId = appointment.getId().toString();
////        String amount = String.format("%.2f", appointment.getPrice());
////        String currency = "LKR";
////        String hash = generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret);
////
////        Map<String, Object> data = new LinkedHashMap<>();
////        data.put("merchant_id", merchantId);
////        data.put("return_url", appBaseUrl + "/payment-success.html");
////        data.put("cancel_url", appBaseUrl + "/payment-cancel.html");
////        data.put("notify_url", appBaseUrl + "/api/v1/payments/notify");
////        data.put("order_id", orderId);
////        data.put("items", "Appointment Payment - " + appointment.getId());
////        data.put("amount", amount);
////        data.put("currency", currency);
////        data.put("hash", hash);
////
////        data.put("first_name", "Customer");
////        data.put("last_name", "Name");
//////        data.put("email", appointment.getEmail());
//////        data.put("phone", appointment.getPhoneNumber());
//////        data.put("address", appointment.getCity() != null ? appointment.getCity() : "Colombo");
//////        data.put("city", appointment.getCity() != null ? appointment.getCity() : "Colombo");
////        data.put("country", "Sri Lanka");
////        data.put("sandbox", "1");
////
////        return data;
////    }
////
////    @Override
////    public void updatePaymentFromPayHere(Map<String, String> params) {
////        Long appointmentId = Long.parseLong(params.get("order_id"));
////        String status = params.get("status");
////        String transactionId = params.get("payment_id");
////
////        Payments payment = paymentsRepository.findByAppointment(appointmentId)
////                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
////        payment.setStatus(status.toUpperCase());
////        payment.setTransactionId(transactionId);
////        paymentsRepository.save(payment);
////    }
////
////    private PaymentsDTO convertToDTO(Payments payment) {
////        return PaymentsDTO.builder()
////                .paymentId(payment.getPaymentId())
////                .appointmentId(payment.getAppointment().getId())
////                .amount(payment.getAmount())
////                .paymentDate(payment.getPaymentDate())
////                .paymentMethod(payment.getPaymentMethod())
////                .transactionId(payment.getTransactionId())
////                .status(payment.getStatus())
////                .build();
////    }
////
////    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String merchantSecret) {
////        try {
////            String secretMd5 = md5Hex(merchantSecret).toUpperCase();
////            return md5Hex(merchantId + orderId + amount + currency + secretMd5).toUpperCase();
////        } catch (Exception e) {
////            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating hash");
////        }
////    }
////
////    private String md5Hex(String input) throws Exception {
////        MessageDigest md = MessageDigest.getInstance("MD5");
////        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
////        StringBuilder sb = new StringBuilder();
////        for (byte b : digest) sb.append(String.format("%02x", b & 0xff));
////        return sb.toString();
////    }
////}
//package com.assignment.backend.service.impl;
//
//import com.assignment.backend.dto.PaymentsDTO;
//import com.assignment.backend.entity.Appointment;
//import com.assignment.backend.entity.Payments;
//import com.assignment.backend.repository.AppointmentRepository;
//import com.assignment.backend.repository.PaymentsRepository;
//import com.assignment.backend.service.PaymentsService;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.nio.charset.StandardCharsets;
//import java.security.MessageDigest;
//import java.time.LocalDateTime;
//import java.util.LinkedHashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Slf4j
//@Service
//public class PaymentsServiceImpl implements PaymentsService {
//
//    @Value("${payhere.merchant-id}")
//    private String merchantId;
//
//    @Value("${payhere.merchant-secret}")
//    private String merchantSecret;
//
//    @Value("${app.base-url}")
//    private String appBaseUrl;
//
//    @Autowired
//    private PaymentsRepository paymentsRepository;
//
//    @Autowired
//    private AppointmentRepository appointmentRepository;
//
//    @Override
//    public PaymentsDTO createPayment(PaymentsDTO paymentsDTO) {
//        Appointment appointment = appointmentRepository.findById(paymentsDTO.getAppointmentId())
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
//                        "Appointment not found with ID: " + paymentsDTO.getAppointmentId()));
//
//        if (paymentsRepository.findByAppointment_Id(paymentsDTO.getAppointmentId()).isPresent()) {
//            throw new ResponseStatusException(HttpStatus.CONFLICT,
//                    "Payment already exists for appointment ID: " + paymentsDTO.getAppointmentId());
//        }
//
//        Payments payment = new Payments();
//        payment.setAppointment(appointment);
//        payment.setAmount(paymentsDTO.getAmount());
//        payment.setPaymentDate(LocalDateTime.now());
//        payment.setPaymentMethod(paymentsDTO.getPaymentMethod());
//        payment.setTransactionId(paymentsDTO.getTransactionId());
//        payment.setStatus(paymentsDTO.getStatus());
//
//        return convertToDTO(paymentsRepository.save(payment));
//    }
//
//    @Override
//    public PaymentsDTO getPaymentById(Long paymentId) {
//        Payments payment = paymentsRepository.findById(paymentId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
//                        "Payment not found with ID: " + paymentId));
//        return convertToDTO(payment);
//    }
//
//    @Override
//    public PaymentsDTO getPaymentByAppointmentId(Long appointmentId) {
//        Payments payment = paymentsRepository.findByAppointment_Id(appointmentId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
//                        "Payment not found for appointment ID: " + appointmentId));
//        return convertToDTO(payment);
//    }
//
//    @Override
//    public List<PaymentsDTO> getAllPayments() {
//        return paymentsRepository.findAll().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public PaymentsDTO updatePaymentStatus(Long paymentId, String status) {
//        Payments payment = paymentsRepository.findById(paymentId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
//                        "Payment not found with ID: " + paymentId));
//        payment.setStatus(status);
//        return convertToDTO(paymentsRepository.save(payment));
//    }
//
//    @Override
//    public Map<String, Object> createPayHereFormData(Long appointmentId) {
//        Appointment appointment = appointmentRepository.findById(appointmentId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
//
//        String orderId = appointment.getId().toString();
//        String amount = String.format("%.2f", appointment.getPrice());
//        String currency = "LKR";
//        String hash = generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret);
//
//        Map<String, Object> data = new LinkedHashMap<>();
//        data.put("merchant_id", merchantId);
//        data.put("return_url", appBaseUrl + "/payment-success.html");
//        data.put("cancel_url", appBaseUrl + "/payment-cancel.html");
//        data.put("notify_url", appBaseUrl + "/api/v1/payments/notify");
//        data.put("order_id", orderId);
//        data.put("items", "Appointment Payment - " + appointment.getId());
//        data.put("amount", amount);
//        data.put("currency", currency);
//        data.put("hash", hash);
//
//        data.put("first_name", "Customer");
//        data.put("last_name", "Name");
////        data.put("email", appointment.getUserEmail());
////        data.put("phone", appointment.getPhoneNumber());
////        data.put("address", appointment.getCity() != null ? appointment.getCity() : "Colombo");
////        data.put("city", appointment.getCity() != null ? appointment.getCity() : "Colombo");
//        data.put("country", "Sri Lanka");
//        data.put("sandbox", "1");
//
//        return data;
//    }
//
//    @Override
//    public void updatePaymentFromPayHere(Map<String, String> params) {
//        Long appointmentId = Long.parseLong(params.get("order_id"));
//        String status = params.get("status");
//        String transactionId = params.get("payment_id");
//
//        Payments payment = paymentsRepository.findByAppointment_Id(appointmentId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
//        payment.setStatus(status.toUpperCase());
//        payment.setTransactionId(transactionId);
//        paymentsRepository.save(payment);
//    }
//
//    private PaymentsDTO convertToDTO(Payments payment) {
//        return PaymentsDTO.builder()
//                .paymentId(payment.getPaymentId())
//                .appointmentId(payment.getAppointment().getId())
//                .amount(payment.getAmount())
//                .paymentDate(payment.getPaymentDate())
//                .paymentMethod(payment.getPaymentMethod())
//                .transactionId(payment.getTransactionId())
//                .status(payment.getStatus())
//                .build();
//    }
//
//    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String merchantSecret) {
//        try {
//            String secretMd5 = md5Hex(merchantSecret).toUpperCase();
//            return md5Hex(merchantId + orderId + amount + currency + secretMd5).toUpperCase();
//        } catch (Exception e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating hash");
//        }
//    }
//
//    private String md5Hex(String input) throws Exception {
//        MessageDigest md = MessageDigest.getInstance("MD5");
//        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
//        StringBuilder sb = new StringBuilder();
//        for (byte b : digest) sb.append(String.format("%02x", b & 0xff));
//        return sb.toString();
//    }
//}
package com.assignment.backend.service.impl;

import com.assignment.backend.dto.PaymentsDTO;
import com.assignment.backend.entity.Appointment;
import com.assignment.backend.entity.Payments;
import com.assignment.backend.repository.AppointmentRepository;
import com.assignment.backend.repository.PaymentsRepository;
import com.assignment.backend.service.EmailService;
import com.assignment.backend.service.PaymentsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PaymentsServiceImpl implements PaymentsService {

    @Value("${payhere.merchant-id}")
    private String merchantId;

    @Value("${payhere.merchant-secret}")
    private String merchantSecret;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;


    @Override
    public PaymentsDTO createPayment(PaymentsDTO dto) {
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        if (paymentsRepository.findByAppointment_Id(dto.getAppointmentId()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment already exists for this appointment");

        Payments payment = new Payments();
        payment.setAppointment(appointment);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod("PAYHERE");
        payment.setTransactionId(dto.getTransactionId());
        payment.setStatus("PENDING");

        return convertToDTO(paymentsRepository.save(payment));
    }

    @Override
    public PaymentsDTO getPaymentById(Long paymentId) {
        return convertToDTO(paymentsRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found")));
    }

    @Override
    public PaymentsDTO getPaymentByAppointmentId(Long appointmentId) {
        return convertToDTO(paymentsRepository.findByAppointment_Id(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found")));
    }

    @Override
    public List<PaymentsDTO> getAllPayments() {
        return paymentsRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PaymentsDTO updatePaymentStatus(Long paymentId, String status) {
        Payments payment = paymentsRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        payment.setStatus(status.toUpperCase());
        Payments saved = paymentsRepository.save(payment);

        // If payment is successful -> mark appointment as Paid + send email
        if ("PAID".equalsIgnoreCase(status)) {
            Appointment appointment = payment.getAppointment();
            appointment.setStatus("PAID");
            appointmentRepository.save(appointment);

            try {
                emailService.sendPaymentConfirmation(
                        appointment.getUser().getEmail(),
                        appointment.getUser().getUsername(),
                        appointment.getService().getName(),
                        appointment.getPrice()
                );
            } catch (Exception e) {
                log.error("Failed to send payment confirmation email", e);
            }
        }

        return convertToDTO(saved);
    }

    @Override
    public Map<String, Object> createPayHereFormData(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));


        if (paymentsRepository.findByAppointment_Id(appointmentId).isEmpty()) {
            Payments payment = new Payments();
            payment.setAppointment(appointment);
            payment.setAmount(new BigDecimal(String.valueOf(appointment.getPrice())));
            payment.setPaymentDate(LocalDateTime.now());
            payment.setPaymentMethod("PAYHERE");
            payment.setStatus("PENDING");
            payment.getTransactionId();
            paymentsRepository.save(payment);
        }


        String orderId = appointment.getId().toString();
        String amount = String.format("%.2f", appointment.getPrice());
        String currency = "LKR";
        String hash = generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("merchant_id", merchantId);
        data.put("return_url", appBaseUrl + "/payment-success.html");
        data.put("cancel_url", appBaseUrl + "/payment-cancel.html");
        data.put("notify_url", appBaseUrl + "/api/v1/payments/notify");
        data.put("order_id", orderId);
        data.put("items", "Appointment Payment - " + appointment.getId());
        data.put("amount", amount);
        data.put("currency", currency);
        data.put("hash", hash);
        data.put("first_name", "Customer");
        data.put("last_name", "User");
//        data.put("email", appointment.getUserEmail());
//        data.put("phone", appointment.getPhoneNumber());
//        data.put("address", appointment.getCity() != null ? appointment.getCity() : "Colombo");
//        data.put("city", appointment.getCity() != null ? appointment.getCity() : "Colombo");
        data.put("country", "Sri Lanka");
        data.put("sandbox", "1");

        return data;
    }

    @Override
    public void updatePaymentFromPayHere(Map<String, String> params) {
        Long appointmentId = Long.parseLong(params.get("order_id"));
        String status = params.get("status");
        String transactionId = params.get("payment_id");

        Payments payment = paymentsRepository.findByAppointment_Id(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        payment.setStatus(status.toUpperCase());
        payment.setTransactionId(transactionId);
        paymentsRepository.save(payment);

        if ("2".equals(status)) { // PayHere "2" means success
            Appointment appointment = payment.getAppointment();
            appointment.setStatus("PAID");
            appointmentRepository.save(appointment);

            emailService.sendPaymentConfirmation(
                    appointment.getUser().getEmail(),
                    appointment.getUser().getUsername(),
                    appointment.getService().getName(),
                    appointment.getPrice()
            );
        }
    }

    private PaymentsDTO convertToDTO(Payments payment) {
        return PaymentsDTO.builder()
                .paymentId(payment.getPaymentId())
                .appointmentId(payment.getAppointment().getId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus())
                .build();
    }

    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String secret) {
        try {
            String secretMd5 = md5Hex(secret).toUpperCase();
            return md5Hex(merchantId + orderId + amount + currency + secretMd5).toUpperCase();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating hash");
        }
    }

    private String md5Hex(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) sb.append(String.format("%02x", b & 0xff));
        return sb.toString();
    }
}
