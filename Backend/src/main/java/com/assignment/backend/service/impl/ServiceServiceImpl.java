//package com.assignment.backend.service.impl;
//
//
//import com.assignment.backend.dto.ServiceDTO;
//import com.assignment.backend.exceptions.ResourceNotFound;
//import com.assignment.backend.repository.ServiceRepository;
//import com.assignment.backend.service.ServiceService;
//import lombok.RequiredArgsConstructor;
//import org.modelmapper.ModelMapper;
//import org.modelmapper.TypeToken;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class ServiceServiceImpl implements ServiceService {
//    @Autowired
//    private final ServiceRepository serviceRepository;
//    private final ModelMapper modelMapper;
//
//
//    @Override
//    public String createService(ServiceDTO serviceDTO) {
//        com.assignment.backend.entity.Service service = com.assignment.backend.entity.Service.builder()
//                .name(serviceDTO.getName())
//                .description(serviceDTO.getDescription())
//                .price(serviceDTO.getPrice())
//                .duration(serviceDTO.getDuration())
//                .imageUrl(serviceDTO.getImageUrl())
//                .createdAt(serviceDTO.getCreatedAt())
//                .build();
//         serviceRepository.save(service);
//         return "Service created successfully";
//    }
//
////    @Override
////    public ServiceDTO updateService( ServiceDTO serviceDTO) {
////        Service service = serviceRepository.findById(id)
////                .orElseThrow(() -> new RuntimeException("Service not found"));
////        service.setName(serviceDTO.getName());
////        service.setDescription(serviceDTO.getDescription());
////        service.setPrice(serviceDTO.getPrice());
////        service.setDuration(serviceDTO.getDuration());
////        service.setImageUrl(serviceDTO.getImageUrl());
////        service.setCreatedAt(serviceDTO.getCreatedAt());
////        return mapToDTO(serviceRepository.save(service));
////        return null;
////    }
//
//    @Override
//    public void updateService(ServiceDTO serviceDTO) {
//        if (serviceDTO == null || serviceDTO.getId() == null){
//            throw new IllegalArgumentException("Service ID cannot be null");
//        }
//
//        serviceRepository.findById(serviceDTO.getId())
//                .orElseThrow(() -> new ResourceNotFound("Service Not Found"));
//
//        serviceRepository.save(
//                modelMapper.map(serviceDTO, com.assignment.backend.entity.Service.class)
//        );
//    }
//
//
//    @Override
//    public void deleteService(Long id) {
//        serviceRepository.deleteById(id);
//    }
//
//    @Override
//    public ServiceDTO getServiceById(Long id) {
////        Service service = serviceRepository.findById(id)
////                .orElseThrow(() -> new RuntimeException("Service not found"));
////        return mapToDTO(service);
//        return null;
//    }
//
//    @Override
//    public List<ServiceDTO> getAllServices() {
//        List<com.assignment.backend.entity.Service> allservices= serviceRepository.findAll();
//        if (allservices.isEmpty()){
//            throw new ResourceNotFound("No Job Found");
//        }
//        return modelMapper.map(allservices, new TypeToken<List<ServiceDTO>>(){}.getType());
//    }
//
//    private ServiceDTO mapToDTO(Service service) {
////        return ServiceDTO.builder()
////                .id(service.getId())
////                .name(service.getName())
////                .description(service.getDescription())
////                .price(service.getPrice())
////                .duration(service.getDuration())
////                .imageUrl(service.getImageUrl())
////                .createdAt(service.getCreatedAt())
////                .build();
//        return null;
//    }
//
//    private Service mapToEntity(ServiceDTO dto) {
////        return Service.builder()
////                .id(dto.getId())
////                .name(dto.getName())
////                .description(dto.getDescription())
////                .price(dto.getPrice())
////                .duration(dto.getDuration())
////                .imageUrl(dto.getImageUrl())
////                .createdAt(dto.getCreatedAt())
////                .build();
//        return null;
//    }
//
//}
package com.assignment.backend.service.impl;

import com.assignment.backend.dto.ServiceDTO;
import com.assignment.backend.exceptions.ResourceNotFound;
import com.assignment.backend.repository.ServiceRepository;
import com.assignment.backend.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final ModelMapper modelMapper;

    @Override
    public String createService(ServiceDTO serviceDTO) {
        var entity = modelMapper.map(serviceDTO, com.assignment.backend.entity.Service.class);
        serviceRepository.save(entity);
        return "Service created successfully";
    }

    @Override
    public void updateService(Long id, ServiceDTO serviceDTO) {
        serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Service Not Found"));
        serviceRepository.save(modelMapper.map(serviceDTO, com.assignment.backend.entity.Service.class));
    }

    @Override
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    @Override
    public ServiceDTO getServiceById(Long id) {
        var service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Service Not Found"));
        return modelMapper.map(service, ServiceDTO.class);
    }

    @Override
    public List<ServiceDTO> getAllServices() {
        List<com.assignment.backend.entity.Service> all = serviceRepository.findAll();
        if (all.isEmpty()) throw new ResourceNotFound("No services found");
        return modelMapper.map(all, new TypeToken<List<ServiceDTO>>() {}.getType());
    }
}

