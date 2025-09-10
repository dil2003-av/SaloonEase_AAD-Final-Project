package com.assignment.backend.repository;

//import com.assignment.spring_security_with_jwt.entity.User;
import com.assignment.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional <User> findByEmail(String email);
}
