package com.eskill.lms.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.eskill.lms.model.Test;
import com.eskill.lms.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestService {
     private final TestRepository testRepository;

    @Autowired
    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    public Test getTestById(Long id) {
        return testRepository.findById(id).orElse(null);
    }

    public List<Test> getTestsByStatus(String status) {
        return testRepository.findByStatus(status);
    }

    public Test addTest(Test test) {
        return testRepository.save(test);
    }

    public Test updateTest(Long id, Test testDetails) {
        Optional<Test> test = testRepository.findById(id);
        if (test.isPresent()) {
            Test updatedTest = test.get();
            updatedTest.setName(testDetails.getName());
            updatedTest.setDescription(testDetails.getDescription());
            updatedTest.setDifficulty(testDetails.getDifficulty());
            updatedTest.setMarks(testDetails.getMarks());
            updatedTest.setTime(testDetails.getTime());
            updatedTest.setTestDate(testDetails.getTestDate());
            updatedTest.setStatus(testDetails.getStatus());
            return testRepository.save(updatedTest);
        }
        return null;
    }

    public void deleteTest(Long id) {
        testRepository.deleteById(id);
    }
}