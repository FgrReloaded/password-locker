package com.locker.locker.security;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

public class CryptoUtils {
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;
    private static final int KEY_LENGTH = 256;
    private static final int ITERATION_COUNT = 65536;

    // Generate a random salt for password hashing
    public static String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    // Hash the master password using PBKDF2
    public static String hashPassword(String password, String salt) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] saltBytes = Base64.getDecoder().decode(salt);
        KeySpec spec = new PBEKeySpec(password.toCharArray(), saltBytes, ITERATION_COUNT, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] hash = factory.generateSecret(spec).getEncoded();
        return Base64.getEncoder().encodeToString(hash);
    }

    // Generate a secret key from the master password and salt
    private static SecretKey getSecretKey(String password, String salt) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] saltBytes = Base64.getDecoder().decode(salt);
        KeySpec spec = new PBEKeySpec(password.toCharArray(), saltBytes, ITERATION_COUNT, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] secretKeyBytes = factory.generateSecret(spec).getEncoded();
        return new SecretKeySpec(secretKeyBytes, "AES");
    }

    // Generate a random initialization vector (IV)
    public static String generateIv() {
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return Base64.getEncoder().encodeToString(iv);
    }

    // Encrypt a password using AES-GCM
    public static String encryptPassword(String password, String masterPassword, String salt, String iv) throws Exception {
        SecretKey key = getSecretKey(masterPassword, salt);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, Base64.getDecoder().decode(iv));
        cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);
        byte[] encryptedBytes = cipher.doFinal(password.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    // Decrypt a password using AES-GCM
    public static String decryptPassword(String encryptedPassword, String masterPassword, String salt, String iv) throws Exception {
        SecretKey key = getSecretKey(masterPassword, salt);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, Base64.getDecoder().decode(iv));
        cipher.init(Cipher.DECRYPT_MODE, key, parameterSpec);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }
}