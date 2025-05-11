package com.eskill.lms.repository;

import com.eskill.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // ✅ Fetch only published courses
    List<Course> findByIsPublished(boolean isPublished);

    // ✅ Fetch enrolled courses for a specific student
    @Query("SELECT e.course FROM Enrollment e WHERE e.student.id = :studentId")
    List<Course> findCoursesByStudentId(Long studentId);
}

