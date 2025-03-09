# Verify JWT Middleware

## Overview

The `verifyJWT` middleware is responsible for verifying JSON Web Tokens (JWT) in incoming requests. It ensures that only authenticated users can access protected routes.

## File Location

The middleware is located in the authentication module and imports necessary utilities from the `utils` and `models` directories.

## Dependencies

This middleware relies on the following dependencies:

- `jsonwebtoken`: Used to decode and verify JWTs.
- `asyncHandler`: A utility function for handling asynchronous errors.
- `ApiError`: Custom error handling class.
- `User` Model: Used to fetch user details from the database.

## Code Breakdown

### Importing Dependencies

```javascript
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
```

- `asyncHandler`: Wraps the middleware function to handle async errors.
- `ApiError`: Custom error class for throwing API-specific errors.
- `jsonwebtoken`: Used for JWT verification.
- `User`: Mongoose model for querying user details.

### Middleware Function: `verifyJWT`

```javascript
export const verifyJWT = asyncHandler(async (req, _, next) => {
```

- `asyncHandler`: Ensures proper error handling in an async function.
- `req`: Request object.
- `_`: Response object (unused in this middleware).
- `next`: Function to proceed to the next middleware or route handler.

### Extracting Token

```javascript
const token =
  req.cookies?.accessToken ||
  req.headers("authorization").replace("Bearer ", "");
```

- First, the middleware attempts to extract the token from `cookies.accessToken`.
- If unavailable, it checks the `authorization` header and removes the `Bearer ` prefix.
- If no token is found, an error is thrown.

### Token Verification

```javascript
if (!token) {
  throw new ApiError(401, "Unauthorized");
}
const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
```

- If no token is provided, it throws a `401 Unauthorized` error.
- The token is verified using `jwt.verify()` with the secret key from environment variables.

### Fetching User from Database

```javascript
const user = await User.findById(decodedToken?._id).select(
  "-password -refreshToken"
);
```

- Uses the decoded token's `_id` to find the corresponding user in the database.
- Excludes `password` and `refreshToken` fields for security reasons.
- If no user is found, it throws a `404 User not found` error.

### Attaching User to Request & Proceeding

```javascript
req.user = user;
next();
```

- Attaches the authenticated user object to the `req` object.
- Calls `next()` to proceed with the request handling.

### Error Handling

```javascript
} catch (error) {
  throw new ApiError(401, error?.message || "Unauthorized");
}
```

- Catches any error that occurs during the process.
- Throws a `401 Unauthorized` error with the specific message from the caught error.

## Summary

This middleware ensures that incoming requests are authenticated by:

1. Extracting the JWT token from cookies or authorization headers.
2. Verifying the token using the secret key.
3. Fetching the corresponding user from the database.
4. Attaching the user object to `req.user` for further processing.
5. Handling errors appropriately and responding with relevant status codes.

## Usage

Include `verifyJWT` in any route that requires authentication:

```javascript
import { verifyJWT } from "../middlewares/auth.js";

router.get("/protected", verifyJWT, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});
```
