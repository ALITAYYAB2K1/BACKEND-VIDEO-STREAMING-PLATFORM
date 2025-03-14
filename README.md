# BACKEND-VIDEO-STREAMING-PLATFORM

## Step 1: Configure Node Project

First, initialize your Node.js project using npm:

```sh
npm init -y
```

Next, install the required modules:

```sh
npm install express mongoose
```

## Step 2: Create Project Structure

Create a `src` directory with the following subdirectories:

- `controllers`: Contains the logic for handling requests and responses.
- `db`: Manages database connections and configurations.
- `middlewares`: Holds middleware functions for request processing.
- `models`: Defines the data schemas and models.
- `routes`: Contains route definitions and mappings.
- `utils`: Utility functions and helpers.
- `app.js`: Main application setup and middleware configuration.
- `constants.js`: Stores constant values used throughout the application.
- `index.js`: Entry point of the application.

## Step 3: Additional Configurations

Add a `.gitignore` file to exclude unnecessary files from version control:

```
node_modules
.env
```

Create a `.env` file for environment variables.

Install Prettier for code formatting:

```sh
npm install --save-dev prettier
```

Add a Prettier configuration file (`.prettierrc`) for consistent code style:

```json
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

## Step 4: Database Connection Precautions

When connecting to the database, always use `try...catch` blocks to handle potential errors. Additionally, use `async` and `await` to manage asynchronous operations, as fetching data from an online database can take time.

Example of connecting to a MongoDB database:

```js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(`Connected to database: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database- connection failed: ", error);
    process.exit(1);
  }
};
export default connectDB;
```

In your `index.js` or `app.js`, call the `connectDB` function to establish the database connection:

```js
const connectDB = require("./db/connectDB");

connectDB();
```

## Step 5: Environment Variables Configuration

To manage environment variables, we use the `dotenv` package. Instead of using the documented format, we import and configure `dotenv` at the top of our entry file (`index.js` or `app.js`):

```js
import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});
```

### Explanation

By importing and configuring `dotenv` in this manner, we ensure that all environment variables are loaded before any other code is executed. This approach is beneficial because:

1. **Early Configuration**: Environment variables are available immediately, preventing potential issues where variables are accessed before they are defined.
2. **Modular Code**: Keeping the configuration at the top of the entry file maintains modularity and readability.
3. **Consistency**: This method aligns with ES6 module syntax, which is consistent with modern JavaScript practices.

### Package.json Script

Additionally, you can add a script to your `package.json` to use `nodemon` with `dotenv` for development:

```json
"scripts": {
  "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```

This script ensures that `dotenv` is configured automatically whenever you run the development server, providing a seamless development experience.

## Step 6: Middleware Configuration

-
- This section of the code configures various middleware for the Express application.
-
- 1.  `app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));`
- - Enables Cross-Origin Resource Sharing (CORS) with specific settings.
- - `origin`: Specifies the allowed origin for CORS requests, typically set via an environment variable.
- - `credentials`: Allows cookies to be sent with cross-origin requests.
-
- 2.  `app.use(cookieParser());`
- - Parses cookies attached to the client request object.
- - Makes cookies available under `req.cookies`.
-
- 3.  `app.use(express.json({ limit: "20kb" }));`
- - Parses incoming requests with JSON payloads.
- - `limit`: Restricts the size of the JSON payload to 20 kilobytes to prevent large payloads.
-
- 4.  `app.use(express.urlencoded({ extended: true }));`
- - Parses incoming requests with URL-encoded payloads.
- - `extended: true`: Allows for rich objects and arrays to be encoded into the URL-encoded format.

## Step 7: Dependencies Overview

This project uses several npm packages to enhance functionality and security. Here's an explanation of each dependency:

```json
"dependencies": {
  "bcrypt": "^5.1.1",
  "cloudinary": "^2.5.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.12.1",
  "mongoose-aggregate-paginate-v2": "^1.1.4",
  "multer": "^1.4.5-lts.1"
}
```

### Package Explanations

1. **bcrypt**: Used for hashing and salting passwords to securely store user credentials in the database, preventing plaintext password storage.

2. **cloudinary**: A cloud service that provides image and video management services. Essential for storing, transforming, and delivering media files in a streaming platform.

3. **cookie-parser**: Middleware that parses cookies attached to client requests, making them easily accessible in request handlers for authentication and session management.

4. **cors**: Enables Cross-Origin Resource Sharing, allowing the API to accept requests from different domains, essential for web applications with separate frontend and backend.

5. **dotenv**: Loads environment variables from a `.env` file into `process.env`, keeping sensitive information like API keys and database credentials secure.

6. **express**: The core web framework for Node.js that provides robust features for building APIs and web applications with middleware support.

7. **jsonwebtoken**: Implements JSON Web Tokens for secure authentication and information exchange between client and server, enabling stateless authentication.

8. **mongoose**: An Object Data Modeling (ODM) library for MongoDB that provides schema validation, relationship management, and a simple query API.

9. **mongoose-aggregate-paginate-v2**: A Mongoose plugin that adds pagination support to MongoDB aggregate queries, essential for handling large video collections efficiently.

10. **multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files (videos and thumbnails) in the streaming platform.

These dependencies form the foundation of our backend video streaming platform, providing security, database management, file handling, and API functionality.
