package com.eskill.lms.repository;

import com.eskill.lms.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByStatus(String status);
}
