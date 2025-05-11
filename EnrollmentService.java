package com.eskill.lms.service;

import com.eskill.lms.model.Course;
import com.eskill.lms.model.Enrollment;
import com.eskill.lms.model.User;
import com.eskill.lms.repository.CourseRepository;
import com.eskill.lms.repository.EnrollmentRepository;
import com.eskill.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public boolean enrollStudent(Long studentId, Long courseId) {
        Optional<User> student = userRepository.findById(studentId);
        Optional<Course> course = courseRepository.findById(courseId);

        if (student.isEmpty() || course.isEmpty()) {
            return false; // Student or Course not found
        }

        if (enrollmentRepository.existsByStudentAndCourse(student.get(), course.get())) {
            return false; // Student is already enrolled
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student.get());
        enrollment.setCourse(course.get());
        enrollmentRepository.save(enrollment);
        return true;
    }

    public List<User> getEnrolledStudents(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(Enrollment::getStudent)
                .collect(Collectors.toList());
    }
}
