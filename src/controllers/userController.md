# User Authentication API Documentation

## Overview

This document provides a detailed breakdown of the user authentication API, covering registration, login, and logout processes. It ensures secure authentication using JWT (JSON Web Tokens) and integrates Cloudinary for image uploads.

---

## Dependencies

The following dependencies are required for this module:

- `jsonwebtoken`: Generates and verifies JWTs.
- `asyncHandler`: Handles asynchronous errors efficiently.
- `ApiError`: Custom error handling class for API responses.
- `ApiResponse`: Formats API responses consistently.
- `User` Model: Manages user authentication and stores data.
- `Cloudinary`: Handles image uploads for avatars and cover images.

---

# 1. Generate Access & Refresh Tokens

## Function Signature

```javascript
const generateAccessAndRefreshToken = async (userId) => { ... };
```

## Explanation

### Step 1: Fetch User from Database

```javascript
const user = await User.findById(userId);
```

- Retrieves the user document based on the provided `userId`.

### Step 2: Generate Tokens

```javascript
const refreshToken = user.generateRefreshToken();
const accessToken = user.generateAccessToken();
```

- Creates a new `refreshToken` and `accessToken` using user-defined methods.

### Step 3: Store Refresh Token in Database

```javascript
user.refreshToken = refreshToken;
await user.save({ validateBeforeSave: false });
```

- Saves the newly generated `refreshToken` in the database.

### Step 4: Return Tokens

```javascript
return { accessToken, refreshToken };
```

- Provides both tokens for further authentication.

---

# 2. User Registration

## Function Signature

```javascript
const registerUser = asyncHandler(async (req, res) => { ... });
```

## Explanation

### Step 1: Extract User Data

```javascript
const { fullname, email, username, password } = req.body;
```

- Extracts user details from the request body.

### Step 2: Validate Required Fields

```javascript
if (
  [fullname, email, username, password].some((field) => field?.trim() === "")
) {
  throw new ApiError(400, "All fields are mandatory");
}
```

- Ensures no required fields are missing.

### Step 3: Check for Existing User

```javascript
const existedUser = await User.findOne({
  $or: [{ email }, { username }],
});
if (existedUser) {
  throw new ApiError(400, "User already exists with this email or username");
}
```

- Checks if a user with the same email or username already exists.

### Step 4: Handle Image Uploads

```javascript
const avatarLocalPath = req.files?.avatar[0]?.path;
let coverImageLocalPath = req.files?.coverImage?.[0]?.path;
```

- Extracts file paths for avatar and cover images.

### Step 5: Upload Images to Cloudinary

```javascript
const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);
```

- Uploads images to Cloudinary and stores the returned URLs.

### Step 6: Create User

```javascript
const user = await User.create({
  fullname,
  email,
  username: username.toLowerCase(),
  password,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
});
```

- Inserts a new user record into the database.

### Step 7: Return Response

```javascript
return res.status(201).json(new ApiResponse(201, createdUser, "User created"));
```

- Sends a success response with user data.

---

# 3. User Login

## Function Signature

```javascript
const loginUser = asyncHandler(async (req, res) => { ... });
```

## Explanation

### Step 1: Extract Credentials

```javascript
const { username, email, password } = req.body;
```

- Retrieves login credentials.

### Step 2: Validate Input

```javascript
if (!username || !email) {
  throw new ApiError(400, "Username or email is mandatory");
}
```

- Ensures username or email is provided.

### Step 3: Find User

```javascript
const user = await User.findOne({
  $or: [{ email }, { username: username.toLowerCase() }],
});
```

- Searches for the user in the database.

### Step 4: Validate Password

```javascript
const isPasswordValid = await user.isPasswordCorrect(password);
if (!isPasswordValid) {
  throw new ApiError(401, "Invalid credentials");
}
```

- Checks if the password is correct.

### Step 5: Generate Tokens

```javascript
const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
  user._id
);
```

- Generates JWT tokens.

### Step 6: Set Cookies and Respond

```javascript
return res
  .status(200)
  .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
  .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
  .json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken, refreshToken },
      "User logged in"
    )
  );
```

- Stores tokens in HTTP-only cookies and sends a response.

---

# 4. User Logout

## Function Signature

```javascript
const logoutUser = asyncHandler(async (req, res) => { ... });
```

## Explanation

### Step 1: Remove Refresh Token

```javascript
await User.findByIdAndUpdate(
  req.user._id,
  { $set: { refreshToken: undefined } },
  { new: true }
);
```

- Deletes the refresh token from the database.

### Step 2: Clear Cookies

```javascript
return res
  .status(200)
  .clearCookie("accessToken", { httpOnly: true, secure: true })
  .clearCookie("refreshToken", { httpOnly: true, secure: true })
  .json(new ApiResponse(200, {}, "User logged out"));
```

- Removes authentication cookies and sends a success response.

---

# Summary

This module provides a robust user authentication system by:

- **Registering Users**: Validates input, checks duplicates, uploads images, and saves data.
- **Logging In Users**: Authenticates credentials and issues JWT tokens.
- **Logging Out Users**: Removes tokens and clears cookies securely.
- **Using Secure Cookies**: Enhances security with HTTP-only cookie storage.

This ensures a scalable, secure authentication process with JWT integration. 🚀
