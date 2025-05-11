package com.eskill.lms.repository;

import com.eskill.lms.model.Enrollment;
import com.eskill.lms.model.Course;
import com.eskill.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentAndCourse(User student, Course course); // ✅ Check if student is already enrolled
    List<Enrollment> findByCourseId(Long courseId); // ✅ Fetch enrollments for a specific course
}
