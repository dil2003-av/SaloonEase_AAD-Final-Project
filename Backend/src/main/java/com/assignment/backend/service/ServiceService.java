package com.assignment.backend.service;


import com.assignment.backend.dto.ServiceDTO;

import java.util.List;

public interface ServiceService {
    String createService(ServiceDTO serviceDTO);
    void updateService( ServiceDTO serviceDTO);
    void deleteService(Long id);
    ServiceDTO getServiceById(Long id);
    List<ServiceDTO> getAllServices();

}
