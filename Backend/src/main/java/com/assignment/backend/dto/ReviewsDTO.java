package com.assignment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewsDTO {
    private Long id;
    private String userEmail;     // reference to user
    private String serviceName;   // reference to service
    private int rating;
    private String reviewText;
    private String status;
}
