# **MongoDB Aggregation Pipeline**

MongoDB's **Aggregation Pipeline** is a powerful framework for processing and transforming data. It operates as a sequence of stages, where each stage performs a specific operation on the input documents and passes the transformed documents to the next stage. This method is efficient for querying large datasets, performing joins, grouping, and computing derived fields.

## **Stages in the Aggregation Pipeline**

1. **`$match`** - Filters documents based on specified conditions.
2. **`$lookup`** - Performs left outer joins between collections.
3. **`$addFields`** - Adds computed fields to documents.
4. **`$project`** - Selects specific fields to include in the output.
5. **`$sort`** - Sorts documents by specified fields.
6. **`$group`** - Groups documents to perform aggregate calculations.

---

# **Detailed Explanation of `getUserChannelProfile` API**

## **Function Overview**

The `getUserChannelProfile` function is an asynchronous Express route handler designed to fetch a user's channel profile based on their username. It retrieves various details, including subscriber count, subscription count, and whether the current user is subscribed to the channel. The function utilizes **MongoDB's Aggregation Pipeline** for efficient data retrieval and processing.

---

## **Breaking the Code into Chunks and Explanation**

### **1. Function Declaration and Request Handling**

```javascript
const getUserChannelProfile = asyncHandler(async (req, res) => {
```

- **`asyncHandler`**: A middleware wrapper that allows handling asynchronous operations and automatically catches errors.
- **`req` (Request Object)**: Contains parameters and user data.
- **`res` (Response Object)**: Used to send responses to the client.

### **2. Extracting the Username from URL Parameters**

```javascript
const { username } = req.params;
if (!username) {
  throw new ApiError(400, "Username is mandatory");
}
```

- Extracts the `username` from request parameters.
- If `username` is not provided, throws an error using `ApiError(400, "Username is mandatory")` (Bad Request).

---

## **MongoDB Aggregation Pipeline Explanation**

### **3. Aggregation Query Using `$match` and `$lookup`**

```javascript
const channel = await User.aggregate([
  {
    $match: {
      username: username?.toLowerCase(),
    },
  },
```

- **`$match`**: Filters documents to include only those matching the provided `username`. This step reduces the number of documents processed in subsequent stages.

```javascript
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers",
    },
  },
```

- **`$lookup` (First Join)**: Joins the `User` collection with the `subscriptions` collection.
  - `from: "subscriptions"`: The foreign collection being referenced.
  - `localField: "_id"`: The field in the `User` collection.
  - `foreignField: "channel"`: The field in `subscriptions` referencing a channel.
  - `as: "subscribers"`: The result is stored in the `subscribers` field.

```javascript
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribedTo",
    },
  },
```

- **`$lookup` (Second Join)**: Retrieves subscriptions where the user is the subscriber.

---

### **4. Adding Computed Fields (`$addFields`)**

```javascript
  {
    $addFields: {
      subscribersCount: { $size: "$subscribers" },
      subscribedToCount: { $size: "$subscribedTo" },
    },
```

- **`$addFields`**: Adds new computed fields to documents.
- **`$size`**: Calculates the array length (number of subscribers and subscriptions).

```javascript
    isSubscribed: {
      $cond: {
        if: {
          $in: [req.user?._id, "$subscribers.subscriber"],
        },
        then: true,
        else: false,
      },
    },
  },
```

- **`$cond`**: Implements conditional logic.
- **`$in`**: Checks if the `req.user._id` exists in the `subscribers` array.
- Returns `true` if the user is subscribed; otherwise, `false`.

---

### **5. Selecting Fields Using `$project`**

```javascript
  {
    $project: {
      fullname: 1,
      username: 1,
      subscribersCount: 1,
      subscribedToCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1,
      email: 1,
      createdAt: 1,
    },
  },
]);
```

- **`$project`**: Selects specific fields to include in the final result.
- **Fields set to `1`** are included, while others are excluded.

---

### **6. Handling Errors and Sending the Response**

```javascript
if (!channel?.length) {
  throw new ApiError(404, "Channel not found");
}
return res
  .status(200)
  .json(new ApiResponse(200, channel[0], "Channel found"));
});
```

- If the `channel` array is empty, throws a `404 - Channel not found` error.
- If the channel exists, sends a **200 OK** response with the channel data.

---

## **Summary of MongoDB Aggregation Pipeline Steps**

| Stage        | Operator                                                                         | Purpose |
| ------------ | -------------------------------------------------------------------------------- | ------- |
| `$match`     | Filters documents based on `username`                                            |
| `$lookup`    | Joins `subscriptions` collection to get `subscribers`                            |
| `$lookup`    | Joins `subscriptions` collection to get `subscribedTo`                           |
| `$addFields` | Computes subscriber and subscription counts and checks if the user is subscribed |
| `$project`   | Selects only relevant fields for output                                          |

---

## **Key Takeaways**

1. **Aggregation Pipeline** efficiently processes MongoDB queries in stages.
2. **`$match`** reduces document count before expensive operations.
3. **`$lookup`** performs left outer joins between collections.
4. **`$addFields`** allows computed properties like subscriber counts.
5. **`$project`** optimizes output by including only necessary fields.
6. The function efficiently retrieves user channel profiles and subscription details in a single query.

---

## Author

**ALI TAYYAB**  
WEB DEVELOPER
