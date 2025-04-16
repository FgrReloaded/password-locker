package com.locker.locker.controller;

import com.locker.locker.dto.PasswordEntryDto;
import com.locker.locker.model.PasswordEntry;
import com.locker.locker.model.User;
import com.locker.locker.repository.PasswordRepository;
import com.locker.locker.repository.UserRepository;
import com.locker.locker.security.CryptoUtils;
import com.locker.locker.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Get all password entries for the current user
    @GetMapping
    public ResponseEntity<?> getAllPasswords(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);

            List<PasswordEntry> passwordEntries = passwordRepository.findByUserId(userId);
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (PasswordEntry entry : passwordEntries) {
                Map<String, Object> entryMap = Map.of(
                    "id", entry.getId(),
                    "website", entry.getWebsite(),
                    "username", entry.getUsername(),
                    "notes", entry.getNotes() != null ? entry.getNotes() : "",
                    "createdAt", entry.getCreatedAt(),
                    "updatedAt", entry.getUpdatedAt()
                );
                responseList.add(entryMap);
            }

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving passwords: " + e.getMessage());
        }
    }

    // Search password entries by website
    @GetMapping("/search")
    public ResponseEntity<?> searchPasswords(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String query) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);

            List<PasswordEntry> passwordEntries = passwordRepository.findByUserIdAndWebsiteContainingIgnoreCase(userId, query);
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (PasswordEntry entry : passwordEntries) {
                Map<String, Object> entryMap = Map.of(
                    "id", entry.getId(),
                    "website", entry.getWebsite(),
                    "username", entry.getUsername(),
                    "notes", entry.getNotes() != null ? entry.getNotes() : "",
                    "createdAt", entry.getCreatedAt(),
                    "updatedAt", entry.getUpdatedAt()
                );
                responseList.add(entryMap);
            }

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching passwords: " + e.getMessage());
        }
    }

    // Get a specific password entry with decrypted password
    @GetMapping("/{id}")
    public ResponseEntity<?> getPassword(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> requestBody) {
        try {
            String masterPassword = requestBody.get("masterPassword");
            if (masterPassword == null || masterPassword.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Master password is required");
            }

            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);

            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            User user = userOptional.get();
            String hashedMasterPassword = CryptoUtils.hashPassword(masterPassword, user.getSalt());

            if (!hashedMasterPassword.equals(user.getMasterPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid master password");
            }

            Optional<PasswordEntry> entryOptional = passwordRepository.findById(id);
            if (entryOptional.isEmpty() || !entryOptional.get().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password entry not found");
            }

            PasswordEntry entry = entryOptional.get();
            String decryptedPassword = CryptoUtils.decryptPassword(
                    entry.getEncryptedPassword(), masterPassword, user.getSalt(), entry.getIv());

            Map<String, Object> response = Map.of(
                "id", entry.getId(),
                "website", entry.getWebsite(),
                "username", entry.getUsername(),
                "password", decryptedPassword,
                "notes", entry.getNotes() != null ? entry.getNotes() : "",
                "createdAt", entry.getCreatedAt(),
                "updatedAt", entry.getUpdatedAt()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving password: " + e.getMessage());
        }
    }

    // Add a new password entry
    @PostMapping
    public ResponseEntity<?> addPassword(
            @RequestBody Map<String, Object> requestBody,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract fields from request body
            String masterPassword = (String) requestBody.get("masterPassword");
            if (masterPassword == null || masterPassword.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Master password is required");
            }

            // Create PasswordEntryDto from request body
            PasswordEntryDto passwordEntryDto = new PasswordEntryDto();
            passwordEntryDto.setWebsite((String) requestBody.get("website"));
            passwordEntryDto.setUsername((String) requestBody.get("username"));
            passwordEntryDto.setPassword((String) requestBody.get("password"));
            passwordEntryDto.setNotes((String) requestBody.get("notes"));

            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);

            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            User user = userOptional.get();
            String hashedMasterPassword = CryptoUtils.hashPassword(masterPassword, user.getSalt());

            if (!hashedMasterPassword.equals(user.getMasterPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid master password");
            }

            String iv = CryptoUtils.generateIv();
            String encryptedPassword = CryptoUtils.encryptPassword(
                    passwordEntryDto.getPassword(), masterPassword, user.getSalt(), iv);

            PasswordEntry passwordEntry = new PasswordEntry();
            passwordEntry.setUserId(userId);
            passwordEntry.setWebsite(passwordEntryDto.getWebsite());
            passwordEntry.setUsername(passwordEntryDto.getUsername());
            passwordEntry.setEncryptedPassword(encryptedPassword);
            passwordEntry.setIv(iv);
            passwordEntry.setNotes(passwordEntryDto.getNotes());
            passwordEntry.setCreatedAt(LocalDateTime.now());
            passwordEntry.setUpdatedAt(LocalDateTime.now());

            passwordRepository.save(passwordEntry);

            return new ResponseEntity<>("Password added successfully!", HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding password: " + e.getMessage());
        }
    }

    // Update an existing password entry
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePassword(
            @PathVariable String id,
            @RequestBody Map<String, Object> requestBody,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract master password from request body
            String masterPassword = (String) requestBody.get("masterPassword");
            if (masterPassword == null || masterPassword.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Master password is required");
            }

            // Create PasswordEntryDto from request body
            PasswordEntryDto passwordEntryDto = new PasswordEntryDto();
            passwordEntryDto.setWebsite((String) requestBody.get("website"));
            passwordEntryDto.setUsername((String) requestBody.get("username"));
            passwordEntryDto.setPassword((String) requestBody.get("password"));
            passwordEntryDto.setNotes((String) requestBody.get("notes"));

            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);

            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            User user = userOptional.get();
            String hashedMasterPassword = CryptoUtils.hashPassword(masterPassword, user.getSalt());

            if (!hashedMasterPassword.equals(user.getMasterPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid master password");
            }

            Optional<PasswordEntry> entryOptional = passwordRepository.findById(id);
            if (entryOptional.isEmpty() || !entryOptional.get().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password entry not found");
            }

            PasswordEntry existingEntry = entryOptional.get();

            // Generate new IV and encrypt the password
            String iv = CryptoUtils.generateIv();
            String encryptedPassword = CryptoUtils.encryptPassword(
                    passwordEntryDto.getPassword(), masterPassword, user.getSalt(), iv);

            existingEntry.setWebsite(passwordEntryDto.getWebsite());
            existingEntry.setUsername(passwordEntryDto.getUsername());
            existingEntry.setEncryptedPassword(encryptedPassword);
            existingEntry.setIv(iv);
            existingEntry.setNotes(passwordEntryDto.getNotes());
            existingEntry.setUpdatedAt(LocalDateTime.now());

            passwordRepository.save(existingEntry);

            return ResponseEntity.ok("Password updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating password: " + e.getMessage());
        }
    }

    // Delete a password entry
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePassword(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);

            Optional<PasswordEntry> entryOptional = passwordRepository.findById(id);
            if (entryOptional.isEmpty() || !entryOptional.get().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password entry not found");
            }

            passwordRepository.deleteById(id);
            return ResponseEntity.ok("Password deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting password: " + e.getMessage());
        }
    }
}