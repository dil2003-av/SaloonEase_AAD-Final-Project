package com.assignment.backend.service.impl;


import com.assignment.backend.dto.ReviewsDTO;

import com.assignment.backend.entity.Reviews;
import com.assignment.backend.entity.Service;
import com.assignment.backend.entity.User;

import com.assignment.backend.repository.ReviewsRepository;
import com.assignment.backend.repository.ServiceRepository;
import com.assignment.backend.repository.UserRepository;

import com.assignment.backend.service.ReviewsService;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;
import java.util.stream.Collectors;

//@org.springframework.stereotype.Service
//
//public class ReviewServiceImpl implements ReviewsService {
//
//    @Autowired
//    private ReviewsRepository reviewRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private ServiceRepository serviceRepository;
//
//    @Override
//    public void saveReview(ReviewsDTO dto) {
//        User user = userRepository.findByEmail(dto.getUserEmail())
//                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserEmail()));
//        // 2️⃣ Find service by name (pick first if multiple)
//        com.assignment.backend.entity.Service service = serviceRepository.findFirstByName(dto.getServiceName())
//                .orElseThrow(() -> new RuntimeException("Service not found with name: " + dto.getServiceName()));
//
//        Reviews review = new Reviews();
//        review.setUser(user);
//        review.setService(service);
//        review.setRating(dto.getRating());
//        review.setReviewText(dto.getReviewText());
//        review.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");
//
//        reviewRepository.save(review);
//    }
//
//    @Override
//    public void updateReview(ReviewsDTO dto) {
//        Reviews review = reviewRepository.findById(dto.getId())
//                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + dto.getId()));
//
//        if (!review.getUser().getEmail().equals(dto.getUserEmail())) {
//            User user = userRepository.findByEmail(dto.getUserEmail())
//                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserEmail()));
//            review.setUser(user);
//        }
//
//        // Update service if name changed
//        if (!review.getService().getName().equals(dto.getServiceName())) {
//            Service service = serviceRepository.findFirstByName(dto.getServiceName())
//                    .orElseThrow(() -> new RuntimeException("Service not found with name: " + dto.getServiceName()));
//            review.setService(service);
//        }
//
//        review.setRating(dto.getRating());
//        review.setReviewText(dto.getReviewText());
//        review.setStatus(dto.getStatus());
//
//        reviewRepository.save(review);
//    }
//
//    @Override
//    public void deleteReview(Long id) {
//        if (!reviewRepository.existsById(id)) {
//            throw new RuntimeException("Review not found with ID: " + id);
//        }
//        reviewRepository.deleteById(id);
//    }
//
//    @Override
//    public List<ReviewsDTO> getAllReviews() {
//        return reviewRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    public void changeReviewStatus(Long id, String status) {
//        Reviews review = reviewRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + id));
//        review.setStatus(status);
//        reviewRepository.save(review);
//    }
//
//    private ReviewsDTO mapToDTO(Reviews review) {
//        return ReviewsDTO.builder()
//                .id(review.getId())
//                .userEmail(review.getUser().getEmail())
//                .serviceName(review.getService().getName())
//                .rating(review.getRating())
//                .reviewText(review.getReviewText())
//                .status(review.getStatus())
//                .build();
//    }
//}
@org.springframework.stereotype.Service
public class ReviewServiceImpl implements ReviewsService {

    @Autowired
    private ReviewsRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public void saveReview(ReviewsDTO dto) {
        User user = userRepository.findByEmail(dto.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserEmail()));

        Service service = serviceRepository.findFirstByName(dto.getServiceName())
                .orElseThrow(() -> new RuntimeException("Service not found with name: " + dto.getServiceName()));

        Reviews review = new Reviews();
        review.setUser(user);
        review.setService(service);
        review.setRating(dto.getRating());
        review.setReviewText(dto.getReviewText());
        review.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");

        reviewRepository.save(review);
    }

    @Override
    public void updateReview(ReviewsDTO dto) {
        Reviews review = reviewRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + dto.getId()));

        if (!review.getUser().getEmail().equals(dto.getUserEmail())) {
            User user = userRepository.findByEmail(dto.getUserEmail())
                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserEmail()));
            review.setUser(user);
        }

        if (!review.getService().getName().equals(dto.getServiceName())) {
            Service service = serviceRepository.findFirstByName(dto.getServiceName())
                    .orElseThrow(() -> new RuntimeException("Service not found with name: " + dto.getServiceName()));
            review.setService(service);
        }

        review.setRating(dto.getRating());
        review.setReviewText(dto.getReviewText());
        review.setStatus(dto.getStatus() != null ? dto.getStatus() : review.getStatus());

        reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found with ID: " + id);
        }
        reviewRepository.deleteById(id);
    }

    @Override
    public List<ReviewsDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void changeReviewStatus(Long id, String status) {
        Reviews review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + id));
        review.setStatus(status);
        reviewRepository.save(review);
    }

    private ReviewsDTO mapToDTO(Reviews review) {
        return ReviewsDTO.builder()
                .id(review.getId())
                .userEmail(review.getUser().getEmail())
                .serviceName(review.getService().getName())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .status(review.getStatus())
                .build();
    }
}

