# User Authentication API Documentation

## Overview

This document explains the user authentication API, which includes registration, login, and logout functionalities. It ensures secure user authentication using JWT (JSON Web Tokens) and integrates Cloudinary for image uploads.

## Dependencies

The following dependencies are required for this module:

- `jsonwebtoken`: Used for generating and verifying JWTs.
- `asyncHandler`: Handles asynchronous errors efficiently.
- `ApiError`: Custom error handling class for API responses.
- `ApiResponse`: Formats API responses consistently.
- `User` Model: Manages user authentication and stores data.
- `Cloudinary`: Handles image uploads for avatars and cover images.

---

## Authentication Routes

### Route: `POST /register`

Handles user registration, including file uploads.

#### Implementation:

```javascript
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
```

#### Process:

1. **Uploads avatar and cover image** using Multer.
2. **Validates user data** (e.g., username, email, password).
3. **Checks for existing users** to prevent duplicates.
4. **Stores user details** in the database.
5. **Returns the newly created user** (excluding sensitive fields).

---

### Route: `POST /login`

Handles user login by verifying credentials and generating tokens.

#### Implementation:

```javascript
router.route("/login").post(loginUser);
```

#### Process:

1. **Extracts credentials** (username or email and password).
2. **Finds the user** in the database.
3. **Validates password** using a secure hashing method.
4. **Generates JWT access and refresh tokens**.
5. **Stores tokens in secure HTTP-only cookies**.
6. **Returns authenticated user data**.

---

### Route: `POST /logout`

Handles user logout by removing the refresh token and clearing cookies.

#### Implementation:

```javascript
router.route("/logout").post(verifyJWT, logoutUser);
```

#### Process:

1. **Requires authentication** using JWT verification middleware.
2. **Removes the refresh token** from the database.
3. **Clears authentication cookies**.
4. **Returns a success message confirming logout**.

---

## Summary

This module provides a secure user authentication system by:

- **Registering Users**: Validating input, checking duplicates, and saving data.
- **Logging In Users**: Authenticating credentials and generating JWTs.
- **Logging Out Users**: Removing tokens from storage and clearing cookies.
- **Using Secure Cookies**: Enhancing security by storing tokens as HTTP-only cookies.
- **Uploading Images**: Handling profile pictures and cover images efficiently.

This implementation ensures robust authentication with JWT and enhances user experience by managing tokens effectively.
