
package com.assignment.backend.service.impl;

import com.assignment.backend.dto.AppointmentDTO;
import com.assignment.backend.entity.Appointment;
import com.assignment.backend.entity.Service;
import com.assignment.backend.entity.User;
import com.assignment.backend.repository.AppointmentRepository;
import com.assignment.backend.repository.ServiceRepository;
import com.assignment.backend.repository.UserRepository;
import com.assignment.backend.service.AppointmentService;
import com.assignment.backend.service.EmailService;
import lombok.RequiredArgsConstructor;


import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final EmailService emailService;

    @Override
    public void saveAppointment(AppointmentDTO dto) {
        User user = userRepository.findByEmail(dto.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Service service = serviceRepository.findFirstByName(dto.getServiceName())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setService(service);
        appointment.setPrice(dto.getPrice() != null ? dto.getPrice() : service.getPrice());
        appointment.setBookingDate(dto.getBookingDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");
        appointment.setNotes(dto.getNotes());

        appointmentRepository.save(appointment);
    }

    @Override
    public void updateAppointment(AppointmentDTO dto) {
        Appointment appointment = appointmentRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getEmail().equals(dto.getUserEmail())) {
            User user = userRepository.findByEmail(dto.getUserEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            appointment.setUser(user);
        }

        if (!appointment.getService().getName().equals(dto.getServiceName())) {
            Service service = serviceRepository.findFirstByName(dto.getServiceName())
                    .orElseThrow(() -> new RuntimeException("Service not found"));
            appointment.setService(service);
        }

        appointment.setPrice(dto.getPrice());
        appointment.setBookingDate(dto.getBookingDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setStatus(dto.getStatus());
        appointment.setNotes(dto.getNotes());

        appointmentRepository.save(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void changeAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        AppointmentDTO dto = mapToDTO(appointment);

        if ("Confirmed".equalsIgnoreCase(status)) {
            emailService.sendAppointmentConfirmationEmail(dto);
        } else if ("Cancelled".equalsIgnoreCase(status)) {
            emailService.sendAppointmentCancellationEmail(dto);
        }
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByEmail(String email) {
        return appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getUser().getEmail().equals(email))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .userEmail(appointment.getUser().getEmail())
                .serviceName(appointment.getService().getName())
                .price(appointment.getPrice())
                .bookingDate(appointment.getBookingDate())
                .appointmentTime(appointment.getAppointmentTime())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .build();
    }
}
