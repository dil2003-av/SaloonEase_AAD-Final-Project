package com.assignment.backend.repository;

import com.assignment.backend.entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentsRepository extends JpaRepository<Payments, Long> {
    Optional<Payments> findByAppointment_Id(Long appointmentId);
}
