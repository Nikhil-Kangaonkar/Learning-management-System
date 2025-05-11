package com.eskill.lms.service;

import com.eskill.lms.dto.UserDTO;
import com.eskill.lms.model.Role;
import com.eskill.lms.model.User;
import com.eskill.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ Method for user registration
    // public User registerUser(String name, String email, String password, Role role) {
    //     // Check if the user already exists
    //     if (userRepository.findByEmail(email).isPresent()) {
    //         throw new RuntimeException("User already exists with this email.");
    //     }

    //     // Encrypt the password before saving
    //     String encryptedPassword = passwordEncoder.encode(password);

    //     // Create a new user
    //     User newUser = new User();
    //     newUser.setName(name);
    //     newUser.setEmail(email);
    //     newUser.setPassword(encryptedPassword);
    //     newUser.setRole(role);

    //     // Save the user to the database
    //     return userRepository.save(newUser);
    // }

    // ✅ Fixed: Role is now always set to STUDENT
    public User registerUser(String name, String email, String password) {
        
    // Check if the user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists with this email.");
        }

    // Encrypt the password before saving
        String encryptedPassword = passwordEncoder.encode(password);

    // Create a new user and **FORCE** the role to STUDENT
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(encryptedPassword);
        newUser.setRole(Role.STUDENT); // ✅ No more role input, only STUDENT

    // Save the user to the database
        return userRepository.save(newUser);
    }


    // ✅ New Method: Authenticate user for login
    public User authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with this email.");
        }

        User user = userOptional.get();

        // Check if password matches
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials. Please try again.");
        }

        return user; // If login is successful, return the user
    }

    // ✅ Implementation of UserDetailsService for Spring Security
    // @Override
    // public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    //     User user = userRepository.findByEmail(email)
    //             .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    //     return org.springframework.security.core.userdetails.User
    //             .withUsername(user.getEmail())
    //             .password(user.getPassword())
    //             .authorities(user.getRole().name()) // Assign role-based authority
    //             .build();
    // }

    // @Override
    // public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    //     User user = userRepository.findByEmail(email)
    //             .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    //     return org.springframework.security.core.userdetails.User
    //             .withUsername(user.getEmail())
    //             .password(user.getPassword())
    //             .authorities("ROLE_" + user.getRole().name()) // ✅ Fixed: Ensuring proper role format
    //             .build();   
    // }
    // @Override
    // public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    //     User user = userRepository.findByEmail(email)
    //             .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    //     return org.springframework.security.core.userdetails.User
    //             .withUsername(user.getEmail())
    //             .password(user.getPassword())
    //             .authorities("ROLE_" + user.getRole().name()) // ✅ Corrected
    //             .build();
    // }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())  // ✅ Fix: No "ROLE_" prefix needed
                .build();
    }




    // ✅ Get all users
    // public List<User> getAllUsers() {
    //     return userRepository.findAll();
    // }
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole()))
            .toList();
    }


    // ✅ Get user by ID
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // ✅ Update user
    public Optional<User> updateUser(Long userId, User updatedUser) {
        return userRepository.findById(userId).map(user -> {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        });
    }

    // ✅ Delete user
    public boolean deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

}
