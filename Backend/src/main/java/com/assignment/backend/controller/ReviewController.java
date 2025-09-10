package com.assignment.backend.controller;

import com.assignment.backend.dto.APIResponse;

import com.assignment.backend.dto.ReviewsDTO;

import com.assignment.backend.service.ReviewsService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewsService reviewService;

    @PostMapping("/create")
    public ResponseEntity<APIResponse> createReview(@RequestBody ReviewsDTO dto) {
        reviewService.saveReview(dto);
        return ResponseEntity.ok(new APIResponse(200, "Review Created Successfully", null));
    }

    @PutMapping("/update")
    public ResponseEntity<APIResponse> updateReview(@RequestBody ReviewsDTO dto) {
        reviewService.updateReview(dto);
        return ResponseEntity.ok(new APIResponse(200, "Review Updated Successfully", null));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<APIResponse> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(new APIResponse(200, "Review Deleted Successfully", null));
    }

    @GetMapping("/getall")
    public ResponseEntity<APIResponse> getAllReviews() {
        List<ReviewsDTO> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(new APIResponse(200, "Success", reviews));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<APIResponse> changeStatus(@PathVariable Long id, @RequestParam String status) {
        reviewService.changeReviewStatus(id, status);
        return ResponseEntity.ok(new APIResponse(200, "Status Updated Successfully", null));
    }
}
