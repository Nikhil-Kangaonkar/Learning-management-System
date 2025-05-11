package com.eskill.lms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentRequest {
    private Long studentId;
    private Long courseId;
}
