package com.assignment.backend.service.impl;

import com.assignment.backend.entity.Role;
import com.assignment.backend.entity.User;
import com.assignment.backend.repository.UserRepository;
import com.assignment.backend.service.AdminService;
import com.assignment.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public User approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus("APPROVED");
        userRepository.save(user);
        emailService.sendApprovalEmail(user.getEmail(), user.getUsername());
        return user;
    }

    @Override
    public User blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus("BLOCKED");
        return userRepository.save(user);
    }

    @Override
    public User changeUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
