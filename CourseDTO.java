package com.eskill.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String longDescription;
    private String batch;
    private String timing;
    private String duration;
    private String mode;
    private Double price;
    private String thumbnailUrl;
    private List<String> objectives;
    private List<String> curriculum;
    private String instructorName;
    private String instructorBio;
}
