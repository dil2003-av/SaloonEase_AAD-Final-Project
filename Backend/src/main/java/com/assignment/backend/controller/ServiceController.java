//package com.assignment.backend.controller;
//
//
//import com.assignment.backend.dto.APIResponse;
//import com.assignment.backend.dto.ServiceDTO;
//import com.assignment.backend.entity.Service;
//import com.assignment.backend.service.ServiceService;
//import com.assignment.backend.service.impl.CloudService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/services")
//@RequiredArgsConstructor
//@CrossOrigin("*") // allow frontend
//public class ServiceController {
//
//    private final ServiceService serviceService;
//    private final CloudService cloudService;
//
//    @PostMapping("create")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<APIResponse> createService(
//            @RequestParam("name") String name,
//            @RequestParam("description") String description,
//            @RequestParam("price") Double price,
//            @RequestParam("duration") String duration,
//            @RequestParam("createdAt") String createdAt,
//            @RequestParam("file") MultipartFile file
//    ) throws IOException {
//
//        // Save the file to disk
////        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
////        Path filePath = Paths.get("uploads/" + fileName);
////        Files.createDirectories(filePath.getParent());
////        Files.write(filePath, file.getBytes());
//
//        String url = cloudService.uploadFile(file);
//
//        // Create service entity
//        ServiceDTO service = new ServiceDTO();
//        service.setName(name);
//        service.setDescription(description);
//        service.setPrice(price);
//        service.setDuration(duration);
//        service.setImageUrl(url);
//        service.setCreatedAt(LocalDate.parse(createdAt));
//
//
//        // Save to DB
//        String message = serviceService.createService(service);
//        return ResponseEntity.ok(new APIResponse(200, "ok", message));
//    }
//
//
//    @GetMapping("getall")
//    public ResponseEntity<APIResponse> getAllServices() {
//        List<ServiceDTO> serviceDTOS = serviceService.getAllServices();
//        return ResponseEntity.ok(
//                new APIResponse(
//                        200,
//                        "Service List Fetched Successfully",
//                        serviceDTOS
//                )
//        );
//    }
//
//    @PutMapping("update")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<APIResponse> updateService(
//            @PathVariable Long id,
//            @RequestParam("name") String name,
//            @RequestParam("description") String description,
//            @RequestParam("price") Double price,
//            @RequestParam("duration") String duration,
//            @RequestParam("createdAt") String createdAt,
//            @RequestParam("file") MultipartFile file
//    ) throws IOException {
//
//
//        String url = cloudService.uploadFile(file);
//
//        // Create service entity
//        ServiceDTO service = new ServiceDTO();
//        service.setName(name);
//        service.setDescription(description);
//        service.setPrice(price);
//        service.setDuration(duration);
//        service.setImageUrl(url);
//        service.setCreatedAt(LocalDate.parse(createdAt));
//
//
//        // Save to DB
//        String message = serviceService.createService(service);
//        return ResponseEntity.ok(new APIResponse(200, "ok", message));
//    }
//
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
//        serviceService.deleteService(id);
//        return ResponseEntity.noContent().build();
//    }
//
////    @GetMapping("search/{keyword}")
////    public ResponseEntity<APIResponse> searchJob(@PathVariable("keyword") String keyword){
////        List<ServiceDTO> serviceDTOS = serviceService.getAllJobsByKeyword(keyword);
////        return ResponseEntity.ok(
////                new APIResponse(
////                200,
////                "Job List Fetched Successfully",
////                serviceDTOS
////        ));
////    }
//
//
//}
package com.assignment.backend.controller;

import com.assignment.backend.dto.APIResponse;
import com.assignment.backend.dto.ServiceDTO;
import com.assignment.backend.service.ServiceService;
import com.assignment.backend.service.impl.CloudService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ServiceController {

    private final ServiceService serviceService;
    private final CloudService cloudService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> createService(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("duration") String duration,
            @RequestParam("createdAt") String createdAt,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String url = cloudService.uploadFile(file);

        ServiceDTO service = new ServiceDTO();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setDuration(duration);
        service.setImageUrl(url);
        service.setCreatedAt(LocalDate.parse(createdAt));

        String message = serviceService.createService(service);
        return ResponseEntity.ok(new APIResponse(200, "ok", message));
    }

    @GetMapping("/getall")
    public ResponseEntity<APIResponse> getAllServices() {
        List<ServiceDTO> serviceDTOS = serviceService.getAllServices();
        return ResponseEntity.ok(new APIResponse(200, "Service List Fetched Successfully", serviceDTOS));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> updateService(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("duration") String duration,
            @RequestParam("createdAt") String createdAt,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        ServiceDTO existing = serviceService.getServiceById(id);

        String imageUrl = existing.getImageUrl();
        if (file != null && !file.isEmpty()) {
            imageUrl = cloudService.uploadFile(file);
        }

        ServiceDTO service = new ServiceDTO();
        service.setId(id);
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setDuration(duration);
        service.setImageUrl(imageUrl);
        service.setCreatedAt(LocalDate.parse(createdAt));

        serviceService.updateService(id, service);
        return ResponseEntity.ok(new APIResponse(200, "ok", "Service updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    // Serve uploaded images
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException {
        Path file = Paths.get("uploads").resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        return ResponseEntity.ok().body(resource);
    }
}
