package com.assignment.backend.service;

import com.assignment.backend.entity.Role;
import com.assignment.backend.entity.User;

import java.util.List;

public interface AdminService {

    User approveUser(Long id);

    User blockUser(Long id);

    User changeUserRole(Long id, Role role);

    void deleteUser(Long id);

    List<User> getAllUsers();
    User unblockUser(Long id);


}
