package com.eskill.lms.controller;

import com.eskill.lms.model.User;
import com.eskill.lms.dto.EnrollmentRequest;
import com.eskill.lms.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/enroll")
    public ResponseEntity<?> enrollStudent(@RequestBody EnrollmentRequest request) {
        boolean enrolled = enrollmentService.enrollStudent(request.getStudentId(), request.getCourseId());
        if (enrolled) {
            return ResponseEntity.ok("✅ Successfully enrolled!");
        } else {
            return ResponseEntity.badRequest().body("❌ Enrollment failed. You might already be enrolled.");
        }
    }

    // ✅ API to Fetch Enrolled Students for a Course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getEnrolledStudents(@PathVariable Long courseId) {
        List<User> students = enrollmentService.getEnrolledStudents(courseId);
        return ResponseEntity.ok(students);
    }
}
