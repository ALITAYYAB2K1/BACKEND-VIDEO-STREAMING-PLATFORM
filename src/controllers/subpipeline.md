# **Sub-Pipelines in MongoDB Aggregation**

## **Overview**

Sub-Pipelines in MongoDB Aggregation allow complex data retrieval by embedding additional lookup stages within a primary lookup. This technique is useful when fetching related data from multiple collections while keeping queries efficient. In this guide, we will break down the `getWatchHistory` function, which utilizes sub-pipelines to retrieve user watch history, video details, and owner information.

---

# **Detailed Explanation of \*\***`getWatchHistory`\***\* API with Sub-Pipeline**

## **Breaking Down the Code**

### **1. Function Declaration and Request Handling**

```javascript
const getWatchHistory = asyncHandler(async (req, res) => {
```

- **`asyncHandler`**: A middleware wrapper that automatically catches and handles asynchronous errors.
- **`req`\*\*** (Request Object)\*\*: Contains user details.
- **`res`\*\*** (Response Object)\*\*: Used to send the response back to the client.

---

## **Understanding the Aggregation Pipeline**

### **2. Matching the User in the \*\***`User`\***\* Collection**

```javascript
const user = await User.aggregate([
  {
    $match: {
      _id: new mongoose.Types.ObjectId(req.user._id),
    },
  },
```

- **`$match`**: Filters the user document by `_id`, ensuring only the requesting user’s data is retrieved.
- **`new mongoose.Types.ObjectId(req.user._id)`**: Converts the `req.user._id` to an ObjectId type for querying MongoDB.

---

### **3. First \*\***`$lookup`\***\* – Fetching Watch History Videos**

```javascript
  {
    $lookup: {
      from: "videos",
      localField: "watchHistory",
      foreignField: "_id",
      as: "watchHistory",
      pipeline: [...]
    },
  },
```

- **`$lookup`\*\*** (First Join)\*\*: Joins the `User` collection with the `videos` collection.
  - `from: "videos"`: Refers to the collection containing video details.
  - `localField: "watchHistory"`: The field in `User` containing an array of video IDs.
  - `foreignField: "_id"`: The field in `videos` collection matching those IDs.
  - **Sub-Pipeline** (`pipeline`): Defines additional operations on the matched `videos` documents.

---

### **4. Sub-Pipeline for Fetching Video Owners**

#### **4.1 Nested \*\***`$lookup`\***\* – Fetching Owner Details**

```javascript
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [...]
            },
          },
```

- **`$lookup`\*\*** (Second Join - Nested)\*\*: Fetches details of the video owner from the `users` collection.
  - `from: "users"`: Refers to the `users` collection.
  - `localField: "owner"`: The field in `videos` storing the owner's `_id`.
  - `foreignField: "_id"`: The `_id` field in `users` to match the owner.
  - **Sub-Pipeline** (`pipeline`): Limits retrieved data to only necessary fields.

#### **4.2 Projecting Relevant Owner Fields**

```javascript
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
```

- **`$project`**: Filters the owner’s details to include only `fullname`, `username`, and `avatar`.

#### **4.3 Flattening the Owner Field**

```javascript
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
```

- **`$addFields`**: Extracts the first element from the `owner` array (since `$lookup` returns an array by default) and assigns it to `owner`.

---

### **5. Handling Errors and Sending Response**

```javascript
  ]);
  if (!user?.length) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch history found"));
});
```

- **Error Handling**: If no user is found, returns a `404` error.
- **Response**: Sends back the `watchHistory` array from the first user found.

---

## **Summary of the Aggregation Pipeline**

| Stage        | Operator                                                    | Purpose |
| ------------ | ----------------------------------------------------------- | ------- |
| `$match`     | Filters the user by `_id`                                   |         |
| `$lookup`    | Fetches video details from `videos` collection              |         |
| `$lookup`    | Fetches owner details from `users` collection inside videos |         |
| `$project`   | Selects only necessary fields from the owner document       |         |
| `$addFields` | Converts owner array to a single object                     |         |

---

## **Key Takeaways**

1. **Sub-Pipelines** allow deeper data retrieval inside `$lookup` operations.
2. **Nested \*\***`$lookup`\*\* helps efficiently fetch related documents.
3. **`$addFields`\*\*** with \***\*`$first`** is used to flatten arrays returned from `$lookup`.
4. **Optimized \*\***`$project`\*\* minimizes data transfer, improving performance.
5. **Error handling** ensures a structured response with proper validation.

---

## Author

**ALI TAYYAB**  
WEB DEVELOPER
