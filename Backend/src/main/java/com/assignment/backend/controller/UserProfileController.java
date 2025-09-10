package com.assignment.backend.controller;

import com.assignment.backend.dto.RegisterDTO;
import com.assignment.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("User is not authenticated");
        }

        String email = authentication.getName();
        RegisterDTO registerDTO = profileService.getUserProfileByEmail(email);

        return ResponseEntity.ok(registerDTO);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody RegisterDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        String email = auth.getName();
        profileService.updateUserProfile(email, dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

}
