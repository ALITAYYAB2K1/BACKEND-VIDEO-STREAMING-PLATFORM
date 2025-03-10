# Routes

This module defines user-related routes using Express.js. It includes authentication, profile management, and user history operations. Each route is protected using middleware for security and file uploads.

## Route Methods

- `.get` - Retrieves data.
- `.post` - Creates or updates data.
- `.patch` - Modifies existing data.

---

## Code Breakdown

### Importing Dependencies

```javascript
import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
```

- `Router` is imported from Express to define modular routes.
- User-related controller functions are imported.
- `upload` middleware is used for handling file uploads.
- `verifyJWT` middleware is used for authentication.

---

## Defining Routes

### 1. **User Registration**

```javascript
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
```

- **POST `/register`** - Registers a new user.
- Uses `multer` to handle file uploads (`avatar` & `coverImage`).

### 2. **User Login**

```javascript
router.route("/login").post(loginUser);
```

- **POST `/login`** - Logs in a user.

### 3. **User Logout (Secure Route)**

```javascript
router.route("/logout").post(verifyJWT, logoutUser);
```

- **POST `/logout`** - Logs out the current user.
- Protected using `verifyJWT`.

### 4. **Refresh Access Token**

```javascript
router.route("/refresh-token").post(refreshAccessToken);
```

- **POST `/refresh-token`** - Generates a new access token.

### 5. **Change Password (Secure Route)**

```javascript
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
```

- **POST `/change-password`** - Changes the current user’s password.
- Requires authentication (`verifyJWT`).

### 6. **Get Current User (Secure Route)**

```javascript
router.route("/current-user").get(verifyJWT, getCurrentUser);
```

- **GET `/current-user`** - Retrieves current user details.
- Requires authentication.

### 7. **Update Account Details (Secure Route)**

```javascript
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
```

- **PATCH `/update-account`** - Updates user details.
- Requires authentication.

### 8. **Update User Avatar (Secure Route)**

```javascript
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
```

- **PATCH `/avatar`** - Updates user profile avatar.
- Uses `multer` to handle file upload.

### 9. **Update Cover Image (Secure Route)**

```javascript
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage);
```

- **PATCH `/cover-image`** - Updates user cover image.
- Uses `multer` to handle file upload.

### 10. **Get User Channel Profile (Secure Route)**

```javascript
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
```

- **GET `/c/:username`** - Retrieves a user’s channel profile.
- Requires authentication.

### 11. **Get Watch History (Secure Route)**

```javascript
router.route("/history").get(verifyJWT, getWatchHistory);
```

- **GET `/history`** - Fetches the user’s watch history.
- Requires authentication.

---

## Exporting the Router

```javascript
export default router;
```

- Exports the router module for use in other parts of the application.

---

This module efficiently handles user-related actions with authentication and file upload capabilities. 🚀
