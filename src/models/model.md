# Entity Relationship Diagram

## Users

![user](icon: user, color: Purple)

- **id**: string (primary key)
- **username**: string
- **email**: string
- **fullName**: string
- **avatar**: string
- **coverImage**: string
- **watchHistory**: ObjectId[] (references videos)
- **password**: string
- **refreshToken**: string
- **createdAt**: Date
- **updatedAt**: Date

## Videos

![video](icon: video, colorMode: bold, color: Orange)

- **id**: string (primary key)
- **owner**: ObjectId (references users)
- **videoFile**: string
- **thumbnail**: string
- **title**: string
- **description**: string
- **duration**: number
- **views**: number
- **isPublished**: boolean
- **createdAt**: Date
- **updatedAt**: Date

## Subscriptions

![money](icon: money, color: Blue)

- **id**: string (primary key)
- **subscriber**: ObjectId (references users)
- **channel**: ObjectId (references users)
- **createdAt**: Date
- **updatedAt**: Date

## Likes

![thumbs-up](icon: thumbs-up, color: Green)

- **id**: string (primary key)
- **video**: ObjectId (references videos)
- **comment**: ObjectId (references comments)
- **tweet**: ObjectId (references tweets)
- **likedBy**: ObjectId (references users)
- **createdAt**: Date
- **updatedAt**: Date

## Comments

![comment](icon: comment, color: Red)

- **id**: string (primary key)
- **video**: ObjectId (references videos)
- **owner**: ObjectId (references users)
- **content**: string
- **createdAt**: Date
- **updatedAt**: Date

## Playlists

![library](icon: library, color: Yellow)

- **id**: string (primary key)
- **owner**: ObjectId (references users)
- **videos**: ObjectId[] (references videos)
- **name**: string
- **description**: string
- **createdAt**: Date
- **updatedAt**: Date

## Tweets

![twitter](icon: twitter, color: Orange)

- **id**: string (primary key)
- **owner**: ObjectId (references users)
- **content**: string
- **createdAt**: Date
- **updatedAt**: Date

## Relationships

- **users.watchHistory** <> **videos.id**
- **videos.owner** - **users.id**
- **subscriptions.subscriber** - **users.id**
- **subscriptions.channel** - **users.id**
- **likes.likedBy** - **users.id**
- **likes.video** - **videos.id**
- **likes.comment** - **comments.id**
- **likes.tweet** - **tweets.id**
- **comments.owner** - **users.id**
- **comments.video** - **videos.id**
- **playlists.owner** - **users.id**
- **playlists.videos** < **videos.id**
- **tweets.owner** - **users.id**

<!--
- **follows.followee** - **users.id**
- **follows.follower** - **users.id**
-->

[models](https://app.eraser.io/workspace/JvQkkHJTzJXTqWFlhx97)
