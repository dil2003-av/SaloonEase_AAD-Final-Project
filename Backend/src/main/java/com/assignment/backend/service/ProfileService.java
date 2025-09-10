package com.assignment.backend.service;

import com.assignment.backend.dto.RegisterDTO;

public interface ProfileService {
    void updateUserProfile(String email, RegisterDTO dto);
    RegisterDTO getUserProfileByEmail(String email);
}
