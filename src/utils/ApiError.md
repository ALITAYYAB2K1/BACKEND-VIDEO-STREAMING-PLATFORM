## ApiError Class Explanation

The `ApiError` class extends the built-in `Error` class in JavaScript to provide a more structured and informative error handling mechanism for API-related errors. Here's a breakdown of its components and benefits:

### Components

1. **Constructor Parameters**:

   - `statusCode`: The HTTP status code associated with the error (e.g., 404 for Not Found, 500 for Internal Server Error).
   - `message`: A human-readable message describing the error. Defaults to "An unknown error occurred!" if not provided.
   - `stack`: The stack trace of the error, useful for debugging. If not provided, it will be automatically captured.
   - `errors`: An array to hold multiple error details, useful for validation errors or batch operations.

2. **Properties**:

   - `statusCode`: Stores the HTTP status code.
   - `data`: Initialized to `null`, can be used to store additional data related to the error.
   - `message`: Stores the error message.
   - `success`: Set to `false` to indicate the operation was not successful.
   - `errors`: Stores the array of error details.

3. **Stack Trace Handling**:
   - If a `stack` is provided, it sets the `stack` property.
   - If no `stack` is provided, it uses `Error.captureStackTrace` to capture the current stack trace.

### Benefits

- **Structured Error Information**: By including properties like `statusCode`, `message`, and `errors`, the `ApiError` class provides a consistent structure for error information, making it easier to handle and log errors.
- **Enhanced Debugging**: The inclusion of a stack trace helps in pinpointing the exact location of the error, which is crucial for debugging.
- **Customizable**: The class allows for customization of the error message and additional error details, making it flexible for different types of errors.
- **Improved Error Handling**: Using a custom error class like `ApiError` allows for more granular and meaningful error handling in your application, improving the overall robustness and user experience.

### Example Usage

```javascript
import { ApiError } from "./path/to/ApiError";

try {
  // Some code that might throw an error
  throw new ApiError(404, "Resource not found");
} catch (error) {
  console.error(error.statusCode); // 404
  console.error(error.message); // "Resource not found"
  console.error(error.stack); // Stack trace
}
```
