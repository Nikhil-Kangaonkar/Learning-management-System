package com.eskill.lms.controller;

import com.eskill.lms.dto.UserDTO;
import com.eskill.lms.model.User;
import com.eskill.lms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // ✅ Signup API (Default Role: STUDENT)
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        try {
            // Extract data from request
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");

            // ✅ Validate required fields
            if (name == null || email == null || password == null) {
                return ResponseEntity.badRequest().body("❌ Missing required fields: name, email, password.");
            }

            

            // ✅ Register user
            User newUser = userService.registerUser(name, email, password);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Something went wrong: " + e.getMessage());
        }
    }

    // ✅ Login API (Hides Password in Response)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            // ✅ Validate input fields
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
            }

            // ✅ Authenticate user
            User authenticatedUser = userService.authenticateUser(email, password);
            

            // ✅ Convert User to UserDTO (Hides Password)
            UserDTO userDTO = new UserDTO(
                authenticatedUser.getId(),
                authenticatedUser.getName(),
                authenticatedUser.getEmail(),
                authenticatedUser.getRole()
            );

            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            // ✅ Ensure JSON format for error responses
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("error", e.getMessage()));
        }
    }
}