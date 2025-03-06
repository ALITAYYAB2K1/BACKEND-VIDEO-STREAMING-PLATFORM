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
