package com.assignment.backend.service;

import com.assignment.backend.dto.PaymentsDTO;

import java.util.List;
import java.util.Map;

public interface PaymentsService {

    PaymentsDTO createPayment(PaymentsDTO paymentsDTO);

    PaymentsDTO getPaymentById(Long paymentId);

    PaymentsDTO getPaymentByAppointmentId(Long appointmentId);

    List<PaymentsDTO> getAllPayments();

    PaymentsDTO updatePaymentStatus(Long paymentId, String status);

    Map<String, Object> createPayHereFormData(Long appointmentId);

    void updatePaymentFromPayHere(Map<String, String> params);
}
