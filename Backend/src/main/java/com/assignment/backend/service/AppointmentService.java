package com.assignment.backend.service;

//import com.salonease.dto.AppointmentDTO;

import com.assignment.backend.dto.AppointmentDTO;

import java.util.List;

public interface AppointmentService {
    void saveAppointment(AppointmentDTO appointmentDTO);
    void updateAppointment(AppointmentDTO appointmentDTO);
    void deleteAppointment(Long id);
    List<AppointmentDTO> getAllAppointments();
    void changeAppointmentStatus(Long id, String status);
    List<AppointmentDTO> getAppointmentsByEmail(String email);
}
