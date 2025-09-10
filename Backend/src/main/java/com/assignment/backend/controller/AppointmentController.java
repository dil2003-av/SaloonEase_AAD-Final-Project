package com.assignment.backend.controller;

import com.assignment.backend.dto.APIResponse;
import com.assignment.backend.dto.AppointmentDTO;
import com.assignment.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/v1/appointments")
@RequiredArgsConstructor
@Slf4j
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("create")
    public ResponseEntity<APIResponse> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        log.info("Appointment creation request: {}", appointmentDTO);
        appointmentService.saveAppointment(appointmentDTO);
        return new ResponseEntity<>(new APIResponse(
                201,
                "Appointment Created Successfully",
                null
        ), HttpStatus.CREATED);
    }

    @PutMapping("update")
    public ResponseEntity<APIResponse> updateAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        appointmentService.updateAppointment(appointmentDTO);
        return ResponseEntity.ok(new APIResponse(
                200,
                "Appointment Updated Successfully",
                null
        ));
    }

    @GetMapping("getall")
    public ResponseEntity<APIResponse> getAllAppointments() {
        List<AppointmentDTO> appointmentDTOS = appointmentService.getAllAppointments();
        return ResponseEntity.ok(new APIResponse(
                200,
                "Appointment List Fetched Successfully",
                appointmentDTOS
        ));
    }

    @PatchMapping("status/{id}")
    public ResponseEntity<APIResponse> changeAppointmentStatus(@PathVariable("id") Long id,
                                                                       @RequestParam("status") String status) {
        appointmentService.changeAppointmentStatus(id, status);
        return ResponseEntity.ok(new APIResponse(
                200,
                "Appointment Status Changed Successfully",
                null
        ));
    }

    @GetMapping("search/{email}")
    public ResponseEntity<APIResponse> searchAppointmentsByEmail(@PathVariable("email") String email) {
        List<AppointmentDTO> appointmentDTOS = appointmentService.getAppointmentsByEmail(email);
        return ResponseEntity.ok(new APIResponse(
                200,
                "Appointments Fetched Successfully",
                appointmentDTOS
        ));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteAppointment(@PathVariable("id") Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(new APIResponse(
                200,
                "Appointment Deleted Successfully",
                null
        ));
    }
}
