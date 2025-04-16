package com.locker.locker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordEntryDto {
    private String website;
    private String username;
    private String password;
    private String notes;
}