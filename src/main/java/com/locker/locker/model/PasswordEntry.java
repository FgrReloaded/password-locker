package com.locker.locker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "passwords")
public class PasswordEntry {
    @Id
    private String id;
    private String userId;
    private String website;
    private String username;
    private String encryptedPassword;
    private String iv; // Initialization Vector for AES encryption
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}