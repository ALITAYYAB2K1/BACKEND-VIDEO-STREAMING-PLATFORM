# ApiResponse Class

The `ApiResponse` class is a utility designed to standardize the structure of responses in an application. This class helps in creating a consistent response format, making it easier to handle responses across different parts of the application.

## Code Explanation

```javascript
class ApiResponse {
  constructor(status, data, message = "Success") {
    this.status = status;
    this.data = data;
    this.message = message;
    this.success = status < 400;
  }
}
export { ApiResponse };
```

### Constructor Parameters

- **status**: The HTTP status code of the response. It indicates the result of the request (e.g., 200 for success, 404 for not found).
- **data**: The payload of the response. This can be any data that needs to be sent back to the client.
- **message**: A message describing the result of the request. It defaults to "Success" if not provided.
- **success**: A boolean value that is automatically set based on the status code. It is `true` if the status code is less than 400, indicating a successful response.

### Benefits

1. **Consistency**: Ensures that all responses follow a consistent structure, making it easier to handle them in the client-side code.
2. **Clarity**: Provides clear and descriptive messages along with the data, improving the readability and debuggability of the responses.
3. **Error Handling**: Simplifies error handling by providing a `success` flag that can be easily checked to determine if the request was successful.

By using the `ApiResponse` class, developers can streamline the process of creating and managing API responses, leading to cleaner and more maintainable code.
