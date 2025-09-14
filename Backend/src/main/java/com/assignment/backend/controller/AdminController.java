package com.assignment.backend.controller;

import com.assignment.backend.entity.Role;
import com.assignment.backend.entity.User;
import com.assignment.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PostMapping("/approve/{id}")
    public User approveUser(@PathVariable Long id) {
        return adminService.approveUser(id);
    }

    @PostMapping("/block/{id}")
    public User blockUser(@PathVariable Long id) {
        return adminService.blockUser(id);
    }

    @PostMapping("/changeRole/{id}")
    public User changeUserRole(@PathVariable Long id, @RequestParam Role role) {
        return adminService.changeUserRole(id, role);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "User deleted successfully";
    }
}
