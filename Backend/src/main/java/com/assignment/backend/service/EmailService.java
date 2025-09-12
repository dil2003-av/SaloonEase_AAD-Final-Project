package com.assignment.backend.service;

import com.assignment.backend.dto.AppointmentDTO;

public interface EmailService {
    void sendAppointmentConfirmationEmail(AppointmentDTO appointmentDTO);
    void sendAppointmentCancellationEmail(AppointmentDTO appointmentDTO);
}
