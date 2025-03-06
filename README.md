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
