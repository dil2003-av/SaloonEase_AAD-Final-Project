package com.assignment.backend.service;



import com.assignment.backend.dto.AuthDTO;
import com.assignment.backend.dto.AuthResponseDTO;
import com.assignment.backend.dto.RegisterDTO;
import com.assignment.backend.entity.Role;
import com.assignment.backend.entity.User;
import com.assignment.backend.repository.UserRepository;
import com.assignment.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        User user =
                userRepository.findByEmail(authDTO.getEmail())
                .orElseThrow(
                        ()-> new UsernameNotFoundException("Username not found"));
        if (!passwordEncoder.matches
                (authDTO.getPassword(),
                        user.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }
        String  token = jwtUtil.generateToken(authDTO.getEmail());
        String role = String.valueOf(user.getRole());
        return new AuthResponseDTO(token,role);
    }
    public String register(RegisterDTO registerDTO) {

        // Check if email already exists
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Password match validation
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Map DTO to Entity
        User user = User.builder()
                .username(registerDTO.getUsername())  // fix here
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .status("PENDING")
                .build();

        userRepository.save(user);
        return "User Registration Successful";
    }

}

