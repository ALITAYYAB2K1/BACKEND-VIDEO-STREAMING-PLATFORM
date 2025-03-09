# Access Token and Refresh Token Explained

## Introduction

Authentication and authorization are crucial aspects of securing web applications. Two commonly used mechanisms for managing user sessions securely are **Access Tokens** and **Refresh Tokens**.

This document provides an in-depth explanation of these tokens, their benefits, and how they are implemented in an authentication system.

---

## 1. What is an Access Token?

An **Access Token** is a short-lived credential used to access protected resources. It is issued upon successful authentication and included in API requests to verify the user's identity and permissions.

### **Key Characteristics**

- Short-lived (e.g., 15 minutes to 1 hour expiration)
- Used in API requests via **Authorization Header** (`Bearer Token`)
- Encoded as a **JSON Web Token (JWT)**
- Contains user-specific claims (e.g., user ID, role, email)

### **Advantages**

✅ Improves security by limiting session time
✅ Reduces server load since authentication isn’t required on every request
✅ Can be verified without database queries (if JWT-based)

### **Example Access Token Payload** (Decoded JWT)

```json
{
  "_id": "64d2f39ac64b82a59d72",
  "email": "user@example.com",
  "username": "john_doe",
  "exp": 1712345678
}
```

---

## 2. What is a Refresh Token?

A **Refresh Token** is a long-lived credential used to obtain a new Access Token without requiring the user to log in again. It is securely stored (e.g., in **HttpOnly Cookies**) and sent to a refresh endpoint when the Access Token expires.

### **Key Characteristics**

- Long-lived (e.g., 7 days to 30 days expiration)
- Stored securely (not exposed in frontend JavaScript)
- Used only to generate a new Access Token
- Must be stored in the database for verification

### **Advantages**

✅ Improves user experience by avoiding frequent logins
✅ Enhances security by reducing exposure of credentials
✅ Prevents the need for users to manually re-authenticate

### **Example Refresh Token Payload**

```json
{
  "_id": "64d2f39ac64b82a59d72",
  "exp": 1723456789
}
```

---

## 3. Token Generation and Storage

### **Access Token Generation**

```js
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};
```

### **Refresh Token Generation**

```js
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
```

### **Storing Refresh Token Securely**

- **Backend Storage:** Saved in the user's database record
- **Client Storage:** Sent as an **HttpOnly Cookie** (not accessible by JavaScript)

---

## 4. Refreshing the Access Token

### **Flow for Refreshing an Access Token**

1. User's Access Token expires
2. Frontend requests a new Access Token using the **Refresh Token**
3. Backend verifies the Refresh Token
4. If valid, a new Access Token is generated and returned
5. New Access Token is used for further API requests

### **Implementation of Refresh Token Endpoint**

```js
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token expired or invalid");
    }

    const options = { httpOnly: true, secure: true };
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Unauthorized request");
  }
});
```

---

## 5. Best Practices for Token Security

✅ **Store Refresh Tokens securely** (Use `HttpOnly`, `Secure` Cookies)
✅ **Set short expiration for Access Tokens** (15-60 minutes)
✅ **Use long expiration for Refresh Tokens** (7-30 days)
✅ **Invalidate Refresh Tokens on logout** (Remove from DB)
✅ **Implement token rotation** (Issue new Refresh Token every time it's used)
✅ **Use HTTPS** to prevent token interception

---

## 6. Conclusion

Access Tokens and Refresh Tokens enhance security and user experience in modern authentication systems. While Access Tokens provide secure API access, Refresh Tokens enable seamless token renewal without requiring frequent logins.

By following best practices, developers can ensure robust security and efficient session management for users.

---

### **References**

- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)

---

## Author

**ALI TAYYAB**  
WEB DEVELOPER
