package com.assignment.backend.service.impl;

import com.assignment.backend.dto.RegisterDTO;
import com.assignment.backend.entity.User;
import com.assignment.backend.repository.ProfileRepository;
import com.assignment.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository userProfileRepository;


    @Override
    public RegisterDTO getUserProfileByEmail(String email) {
        User user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // If role field exists as String
        String role = String.valueOf(user.getRole()); // make sure User class has getRole() method

        return new RegisterDTO(
                user.getEmail(),
                user.getUsername(),
                null, // do not expose password
                null, // confirm password null
                role
        );
    }

    private final PasswordEncoder passwordEncoder; // inject the existing bean

    @Override
    public void updateUserProfile(String email, RegisterDTO dto) {
        User user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setUsername(dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userProfileRepository.save(user);
    }


}
