package com.eskill.lms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // ✅ Ensures proper field name

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String longDescription; // ✅ Detailed course description

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private boolean isPublished = false; // Default: Unpublished

    @Column(nullable = false)
    private String thumbnailUrl; // ✅ URL for course thumbnail image

    // ✅ New fields for course details
    private String batch;
    private String timing;
    private String duration;
    private String mode;

    // ✅ Instructor details
    private String instructorName;

    @Column(columnDefinition = "TEXT")
    private String instructorBio;

    @Column(name = "video_url", length = 255)
    private String videoUrl;
     
    // ✅ Getters and Setters (Lombok automatically generates these)
}
