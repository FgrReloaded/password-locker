package com.locker.locker.repository;

import com.locker.locker.model.PasswordEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PasswordRepository extends MongoRepository<PasswordEntry, String> {
    List<PasswordEntry> findByUserId(String userId);
    List<PasswordEntry> findByUserIdAndWebsiteContainingIgnoreCase(String userId, String website);
}