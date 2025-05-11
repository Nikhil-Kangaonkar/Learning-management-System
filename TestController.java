package com.eskill.lms.controller;

import com.eskill.lms.model.Test;
import com.eskill.lms.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")

public class TestController {
    private final TestService testService;

    @Autowired
    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping
    public List<Test> getAllTests() {
        return testService.getAllTests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        if (test != null) {
            return ResponseEntity.ok(test);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public List<Test> getTestsByStatus(@PathVariable String status) {
        return testService.getTestsByStatus(status);
    }

    @PostMapping
    public ResponseEntity<Test> addTest(@RequestBody Test test) {
        Test savedTest = testService.addTest(test);
        return ResponseEntity.ok(savedTest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Test> updateTest(@PathVariable Long id, @RequestBody Test testDetails) {
        Test updatedTest = testService.updateTest(id, testDetails);
        if (updatedTest != null) {
            return ResponseEntity.ok(updatedTest);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }
}
