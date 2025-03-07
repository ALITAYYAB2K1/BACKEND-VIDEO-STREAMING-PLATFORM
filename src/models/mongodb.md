````markdown
### Explanation of Code

The following code snippets are used to integrate pagination functionality into a Mongoose schema using the `mongoose-aggregate-paginate-v2` plugin.

```javascript
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
```
````

This line imports the `mongoose-aggregate-paginate-v2` package, which is a Mongoose plugin that adds pagination capabilities to Mongoose aggregate queries. Pagination is essential for efficiently handling large datasets by breaking them into smaller, manageable chunks.

```javascript
videoSchema.plugin(mongooseAggregatePaginate);
```

This line applies the `mongoose-aggregate-paginate-v2` plugin to the `videoSchema`. By doing this, the schema now has access to the pagination methods provided by the plugin. This allows you to perform paginated queries on the `videoSchema` model, making it easier to retrieve and display data in a paginated format.

````
```javascript
videoSchema.plugin(mongooseAggregatePaginate);
````

This line applies the `mongoose-aggregate-paginate-v2` plugin to the `videoSchema`. By doing this, the schema now has access to the pagination methods provided by the plugin. This allows you to perform paginated queries on the `videoSchema` model, making it easier to retrieve and display data in a paginated format.

Pagination is a process of dividing a large set of data into smaller chunks, or "pages". Instead of loading all the data at once, which can be inefficient and slow, pagination allows you to load data in smaller, more manageable pieces. For example, if you have a database of 1000 videos, you might want to display only 10 videos at a time on a web page. With pagination, you can retrieve the first 10 videos, then the next 10, and so on, until all the data has been displayed. This improves performance and provides a better user experience.

````markdown
### User Schema Methods and Middleware

The following code snippets demonstrate how to add middleware and methods to a Mongoose schema for handling user authentication and token generation.

```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

This middleware function runs before a user document is saved. It checks if the password field has been modified. If it has, the password is hashed using `bcrypt` before saving the document. This ensures that user passwords are stored securely in the database.

```javascript
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
```

This method compares a given password with the hashed password stored in the database. It uses `bcrypt` to perform the comparison and returns a boolean indicating whether the passwords match. This is useful for authenticating users during login.

```javascript
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
```

This method generates an access token for the user using `jsonwebtoken`. The token includes the user's ID, email, username, and full name, and is signed with a secret key. The token has an expiration time defined by the `ACCESS_TOKEN_EXPIRY` environment variable. Access tokens are used to authenticate API requests.

```javascript
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
```

This method generates a refresh token for the user. The refresh token includes only the user's ID and is signed with a different secret key. The token has an expiration time defined by the `REFRESH_TOKEN_EXPIRY` environment variable. Refresh tokens are used to obtain new access tokens without requiring the user to log in again.
````
