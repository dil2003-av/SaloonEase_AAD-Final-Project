package com.assignment.backend.repository;

//import com.salonease.entity.Appointment;
import com.assignment.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserEmail(String email); // For search by email
}
