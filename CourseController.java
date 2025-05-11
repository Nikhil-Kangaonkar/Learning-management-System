package com.eskill.lms.controller;

import com.eskill.lms.model.Course;
import com.eskill.lms.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // ✅ Add a new course
    @PostMapping("/add")
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        // ✅ Ensure a thumbnail is set
        if (course.getThumbnailUrl() == null || course.getThumbnailUrl().isEmpty()) {
            course.setThumbnailUrl("default-thumbnail.jpg"); // ✅ Default thumbnail
        }

        if (course.getVideoUrl() == null || course.getVideoUrl().isEmpty()) {
            course.setVideoUrl(null); // ✅ Default video (Change later)
        }

        Course savedCourse = courseService.addCourse(course);
        return ResponseEntity.ok(savedCourse);
    }

    // ✅ Get all courses
    @GetMapping("/all")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    // ✅ Get a course by ID
    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable Long courseId) {
        Optional<Course> course = courseService.getCourseById(courseId);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        } else {
            return ResponseEntity.badRequest().body("Course not found!"); // ✅ Fixed error
        }
    }

    // ✅ Update a course
    @PutMapping("/update/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable Long courseId, @RequestBody Course updatedCourse) {
        Optional<Course> updated = courseService.updateCourse(courseId, updatedCourse);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.badRequest().body("Course not found!"); // ✅ Fixed error
        }
    }

    // ✅ Delete a course
    @DeleteMapping("/delete/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        boolean isDeleted = courseService.deleteCourse(courseId);
        if (isDeleted) {
            return ResponseEntity.ok("Course deleted successfully!");
        } else {
            return ResponseEntity.badRequest().body("Course not found!");
        }
    }

    @PutMapping("/publish/{courseId}")
    public ResponseEntity<?> togglePublishStatus(@PathVariable Long courseId) {
        Optional<Course> updatedCourse = courseService.toggleCoursePublishStatus(courseId);
    
        if (updatedCourse.isPresent()) {
            return ResponseEntity.ok(updatedCourse.get()); // ✅ Returns updated course object
        } else {
            return ResponseEntity.badRequest().body("Course not found!"); // ✅ Ensures consistent return type
        }
    }

    @GetMapping("/published")
    public ResponseEntity<List<Course>> getPublishedCourses() {
        return ResponseEntity.ok(courseService.getPublishedCourses());
    }


    // ✅ API to Get Enrolled Courses for a Student
    @GetMapping("/enrolled/{studentId}")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.getEnrolledCourses(studentId));
    }
}
