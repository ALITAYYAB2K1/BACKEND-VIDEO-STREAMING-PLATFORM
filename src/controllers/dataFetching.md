# HTTP Request Data Formats

When building backend APIs, you need to handle data sent by clients in various formats. Here are the common ways to access request data:

## `req.body`

Used to access data sent in the request body, typically with POST, PUT, or PATCH requests.

```javascript
// Access JSON data sent in request body
app.post("/videos", (req, res) => {
  const { title, description, duration } = req.body;
  // Process the data
});
```

**Note**: Requires middleware to parse the body (e.g., `express.json()` in Express.js)

## `req.params`

Access route parameters (parts of the URL path):

```javascript
// Route: /videos/:videoId
app.get("/videos/:videoId", (req, res) => {
  const videoId = req.params.videoId;
  // Fetch video with the specified ID
});
```

## `req.query`

Access query string parameters (after the ? in URLs):

```javascript
// URL: /videos?category=tutorial&sort=newest
app.get("/videos", (req, res) => {
  const category = req.query.category; // "tutorial"
  const sortOrder = req.query.sort; // "newest"
  // Filter and sort videos
});
```

## `req.headers`

Access HTTP headers:

```javascript
app.get("/videos", (req, res) => {
  const authToken = req.headers.authorization;
  const contentType = req.headers["content-type"];
  // Process based on headers
});
```

## File Uploads

Using a multipart form data (requires specific middleware like `multer`):

```javascript
// Using multer for file uploads
app.post("/videos/upload", upload.single("videoFile"), (req, res) => {
  const file = req.file;
  const title = req.body.title;
  // Process uploaded file
});
```

## Best Practices

1. Always validate and sanitize user input
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. Set proper Content-Type headers
4. Implement rate limiting for API endpoints
5. Consider using a validation library (e.g., Joi, express-validator)

## Author

**ALI TAYYAB**  
WEB DEVELOPER
