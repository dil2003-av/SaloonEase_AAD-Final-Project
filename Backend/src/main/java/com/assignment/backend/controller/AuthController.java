package com.assignment.backend.controller;

import com.assignment.backend.dto.APIResponse;
import com.assignment.backend.dto.AuthDTO;
import com.assignment.backend.dto.RegisterDTO;
import com.assignment.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> registerUser(
            @RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                authService.register(registerDTO)));
    }
    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(
            @RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                authService.authenticate(authDTO)));
    }
}