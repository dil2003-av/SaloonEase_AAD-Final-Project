package com.assignment.backend.repository;

//import com.assignment.backend.entity.Review;
import com.assignment.backend.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Long> {
}
