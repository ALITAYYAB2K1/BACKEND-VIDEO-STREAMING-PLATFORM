# Password Reset Functionality Documentation

This module handles the password reset flow for users, providing endpoints for requesting a password reset and setting a new password.

## Functions

### forgotPassword

**Description**:  
Handles requests to reset a forgotten password. It generates a reset token, saves it to the user record, and emails the user a link with reset instructions.

**Request Parameters**:

- `req.body.email`: User's email address (required)

**Process Flow**:

1. Finds a user with the provided email address
2. Generates a reset password token for the user
3. Saves the token to the user record (without validation)
4. Constructs a reset password URL using the environment variable `DASHBOARD_URL` and the token
5. Sends an email to the user containing the reset URL
6. Returns a success response if the email is sent successfully

**Error Handling**:

- Returns 404 error if user is not found
- Returns 500 error if there's an issue sending the email
- If email sending fails, the token is cleared from the user record

**Response**:

- Status 200 with success message when email is sent successfully

### resetPassword

**Description**:  
Processes the actual password reset when a user submits a new password after clicking the reset link.

**Request Parameters**:

- `req.params.resetToken`: Token from the reset URL (required)
- `req.body.password`: New password (required)
- `req.body.confirmPassword`: Password confirmation (required)

**Process Flow**:

1. Hashes the provided token
2. Finds a user with a matching reset token that hasn't expired
3. Validates that the password and confirmPassword match
4. Updates the user's password
5. Clears the reset token fields
6. Saves the user record
7. Generates new access and refresh tokens
8. Sets authentication cookies
9. Returns a success response with the new tokens

**Error Handling**:

- Returns 400 error if token is missing or invalid
- Returns 400 error if token has expired
- Returns 400 error if password fields are missing
- Returns 400 error if passwords don't match

**Response**:

- Status 200 with new access and refresh tokens when password is changed successfully
- Sets HTTP-only secure cookies for authentication

## Dependencies

This module relies on:

- User model with methods for generating reset tokens
- `asyncHandler` for exception handling
- `ApiError` and `ApiResponse` for consistent error and response formatting
- `sendEmail` utility for sending emails
- `crypto` module for token hashing
- `generateAccessAndRefreshToken` utility for authentication token generation

## Code Implementation

### forgotPassword Implementation

```javascript
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Send email with resetToken
  const resetPasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `your reset password token is as follows: \n\n ${resetPasswordURL} \n\n if you have not requested this email, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Error while sending email");
  }
});
```

### resetPassword Implementation

```javascript
const resetPassword = asyncHandler(async (req, res, next) => {
  const token = req.params.resetToken;
  if (!token) {
    throw new ApiError(400, "Invalid token");
  }
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid token or token expired");
  }
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    throw new ApiError("Please provide all fields", 400);
  }
  if (password !== confirmPassword) {
    throw new ApiError("Passwords do not match", 400);
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "password changed successfully"
      )
    );
});
```
