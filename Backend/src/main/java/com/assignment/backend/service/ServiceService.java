package com.assignment.backend.service;

import com.assignment.backend.dto.ServiceDTO;

import java.util.List;

public interface ServiceService {

    // Create a new service
    String createService(ServiceDTO serviceDTO);

    // Update existing service by ID
    void updateService(Long id, ServiceDTO serviceDTO);

    // Delete service by ID
    void deleteService(Long id);

    // Get service by ID
    ServiceDTO getServiceById(Long id);

    // Get all services
    List<ServiceDTO> getAllServices();
}
