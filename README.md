# Locker - Secure Password Manager

Locker is a secure password management system that allows users to store and retrieve passwords safely using encryption. This application demonstrates secure handling of sensitive data using Java cryptography.

## Features

- Secure user authentication with master password
- AES-GCM encryption for password storage
- JWT-based authentication for API security
- Modern, responsive UI with React and Tailwind CSS
- Password generation functionality
- Search and filter stored passwords
- Copy passwords to clipboard with a single click

## Technology Stack

### Backend
- Java Spring Boot
- Spring Security
- MongoDB for data storage
- Java Cryptography (AES-GCM)
- JWT for authentication

### Frontend
- React with TypeScript
- Vite.js for development and building
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MongoDB

### Setup and Running

#### Backend

1. Start MongoDB:
   ```
   mongod --dbpath=/path/to/data/db
   ```

2. Navigate to the project root:
   ```
   cd /path/to/locker
   ```

3. Run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   The backend will start on http://localhost:8080

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd /path/to/locker/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Security Features

1. **Master Password**: All password entries are encrypted using the user's master password. The master password itself is never stored in plain text; only a securely hashed version is saved.

2. **AES-GCM Encryption**: Password entries are encrypted using the AES algorithm in GCM mode, providing both confidentiality and integrity.

3. **Initialization Vector (IV)**: Each password entry uses a unique IV, ensuring that even identical passwords result in different ciphertexts.

4. **Password Salting**: User master passwords are salted before hashing to prevent rainbow table attacks.

5. **Stateless JWT Authentication**: API security is implemented using JWT tokens, allowing for stateless authentication.

## Usage Flow

1. Register an account with a secure master password
2. Log in using your credentials
3. Add password entries for various websites and services
4. View, edit, or delete password entries as needed
5. Search for specific password entries
6. Securely log out when done

## Notes for Production

This application is a demonstration of secure password management principles. For production use, consider the following additional measures:

1. Use HTTPS for all communications
2. Implement rate limiting for authentication endpoints
3. Set up proper backup and disaster recovery procedures
4. Implement multi-factor authentication
5. Add session timeout and automatic logout features