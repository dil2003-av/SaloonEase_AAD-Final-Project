package com.assignment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PopularServiceDTO {
    private String serviceName;
    private Long usageCount;
}
