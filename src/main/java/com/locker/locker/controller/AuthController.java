package com.locker.locker.controller;

import com.locker.locker.dto.LoginDto;
import com.locker.locker.dto.UserDto;
import com.locker.locker.model.User;
import com.locker.locker.repository.UserRepository;
import com.locker.locker.security.CryptoUtils;
import com.locker.locker.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            // Check if username or email already exists
            if (userRepository.existsByUsername(userDto.getUsername())) {
                return ResponseEntity.badRequest().body("Username is already taken!");
            }

            if (userRepository.existsByEmail(userDto.getEmail())) {
                return ResponseEntity.badRequest().body("Email is already in use!");
            }

            // Generate salt and hash the password
            String salt = CryptoUtils.generateSalt();
            String hashedPassword = CryptoUtils.hashPassword(userDto.getPassword(), salt);

            // Create new user
            User user = new User();
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setMasterPasswordHash(hashedPassword);
            user.setSalt(salt);

            userRepository.save(user);

            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDto loginDto) {
        try {
            Optional<User> userOptional = userRepository.findByUsername(loginDto.getUsername());

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
            }

            User user = userOptional.get();
            String hashedPassword = CryptoUtils.hashPassword(loginDto.getPassword(), user.getSalt());

            if (!hashedPassword.equals(user.getMasterPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error authenticating user: " + e.getMessage());
        }
    }
}