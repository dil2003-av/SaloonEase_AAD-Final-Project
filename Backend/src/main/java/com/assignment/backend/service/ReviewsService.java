package com.assignment.backend.service;

//import com.assignment.backend.dto.ReviewDTO;
import com.assignment.backend.dto.ReviewsDTO;

import java.util.List;

public interface ReviewsService {
    void saveReview(ReviewsDTO dto);
    void updateReview(ReviewsDTO dto);
    void deleteReview(Long id);
    List<ReviewsDTO> getAllReviews();
    void changeReviewStatus(Long id, String status);
}
