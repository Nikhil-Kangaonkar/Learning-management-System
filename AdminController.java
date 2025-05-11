package com.eskill.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ADMIN')") //  Ensure this is present
    public ResponseEntity<?> getAdminDashboard() {
        return ResponseEntity.ok("Welcome to the Admin Dashboard! Only admins can access this.");
    }
}
