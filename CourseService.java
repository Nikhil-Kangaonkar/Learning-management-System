package com.eskill.lms.service;

import com.eskill.lms.model.Course;
import com.eskill.lms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }

    // ✅ Fetch enrolled courses for a student
    public List<Course> getEnrolledCourses(Long studentId) {
        return courseRepository.findCoursesByStudentId(studentId);
    }

    public Optional<Course> updateCourse(Long courseId, Course updatedCourse) {
        return courseRepository.findById(courseId).map(course -> {
            course.setTitle(updatedCourse.getTitle());
            course.setDescription(updatedCourse.getDescription());
            course.setPrice(updatedCourse.getPrice());
            course.setThumbnailUrl(updatedCourse.getThumbnailUrl());
            course.setVideoUrl(updatedCourse.getVideoUrl());
            return courseRepository.save(course);
        });
    }

    public boolean deleteCourse(Long courseId) {
        if (courseRepository.existsById(courseId)) {
            courseRepository.deleteById(courseId);
            return true;
        }
        return false;
    }

    // ✅ Toggle publish status
    public Optional<Course> toggleCoursePublishStatus(Long courseId) {
        return courseRepository.findById(courseId).map(course -> {
            course.setPublished(!course.isPublished());
            return courseRepository.save(course);
        });
    }

    // ✅ Fetch published courses only
    public List<Course> getPublishedCourses() {
        return courseRepository.findByIsPublished(true);
    }
}
