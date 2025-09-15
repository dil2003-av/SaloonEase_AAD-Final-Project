package com.assignment.backend.service;

import com.assignment.backend.dto.AppointmentDTO;

public interface EmailService {
    void sendAppointmentConfirmationEmail(AppointmentDTO appointmentDTO);

    void sendAppointmentCancellationEmail(AppointmentDTO appointmentDTO);

    void sendApprovalEmail(String toEmail, String username);


    void sendBlockEmail(String email, String username);


    void sendUnblockEmail(String email, String username);

    void sendPaymentConfirmation(String to, String name, String serviceName, double amount);

    void sendPaymentReceivedEmail(String toEmail, String username, AppointmentDTO dto);
}
