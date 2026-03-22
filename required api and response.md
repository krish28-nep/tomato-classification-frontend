

## Table of Contents

- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [Disease Detection](#disease-detection)
- [Posts](#posts)
- [Likes & Dislikes](#likes--dislikes)
- [Comments](#comments)
- [Notifications](#notifications)
- [Profile](#profile)
- [Data Models](#data-models)

---

## Authentication

> All protected routes require the `Authorization: Bearer <token>` header.

---

### `POST /auth/login`

Authenticate an existing user and receive a session token.
where backend saves token jwt token in cookie 

**Request Body**

| Field      | Type     | Required | Description            |
|------------|----------|----------|------------------------|
| `email`    | `string` | ✔        | User's email address   |
| `password` | `string` | ✔        | User's password        |

```json
{
  "email": "farmer@example.com",
  "password": "securepassword"
}
```

**Response `200 OK`**

```json
{
  "message": "Login successful",
  "user": { ...user-detail }
}
```

---

### `POST /auth/register`

Register a new user account.

**Request Body**

| Field      | Type     | Required | Description                       |
|------------|----------|----------|-----------------------------------|
| `email`    | `string` | ✔        | User's email address              |
| `name`     | `string` | ✔        | Display name                      |
| `role`     | `Role`   | ✔        | `FARMER` or `EXPERT`              |
| `password` | `string` | ✔        | Password (min. 8 chars recommended) |

```json
{
  "email": "expert@example.com",
  "name": "Dr. Jane Smith",
  "role": "EXPERT",
  "password": "securepassword"
}
```

**Response `201 Created`**

```json
{
  "message": "Register successful",
  "user": { ...user-detail }
}
```

**Role Enum**

| Value    | Description                        |
|----------|------------------------------------|
| `FARMER` | Standard farmer user               |
| `EXPERT` | Agricultural expert / specialist   |

---

### `GET /auth/me`

> Requires Authentication

Retrieve the currently authenticated user's information.
return req.user ( the user's data detail )

**Response `200 OK`**

```json
{
  "id": 1,
  "name": "Dr. Jane Smith",
  "email": "expert@example.com",
  "role": "EXPERT"
}
```

---

## Dashboard

> All dashboard endpoints require authentication. Data is scoped to the authenticated user.

---

### `GET /dashboard/total-scans`

Returns the number of disease scans performed by the user.

**Response `200 OK`**

```json
{
  "totalScans": 14
}
```

---

### `GET /dashboard/diseases-found`

Returns the total number of diseases detected across all scans by the user.

**Response `200 OK`**

```json
{
  "totalDiseases": 7
}
```

---

### `GET /dashboard/my-post-count`

Returns the total number of community posts created by the user.

**Response `200 OK`**

```json
{
  "totalPosts": 23
}
```

---

### `GET /dashboard/my-comment-count`

Returns the total number of comments submitted by the user.

**Response `200 OK`**

```json
{
  "totalComments": 58
}
```

---

### `GET /dashboard/recent-posts`

Returns the most recent community posts for the dashboard feed.

**Response `200 OK`**

```json
{
  "posts": [ ...Post[] ]
}
```

---

## Disease Detection

> Requires Authentication

---

### `POST /disease/scan`

Upload a crop image to detect diseases using AI analysis.

**Content-Type:** `multipart/form-data`

| Field   | Type   | Required | Description               |
|---------|--------|----------|---------------------------|
| `image` | `file` | ✔        | Image file (JPG/PNG/WEBP) |

**Response `200 OK`**

```json
{
  "name": "Late Blight",
  "symptoms": "Dark brown lesions on leaves with pale green borders...",
  "description": "A destructive disease caused by Phytophthora infestans...",
  "prevention": "Apply fungicide, remove infected tissue, improve airflow..."
}
```

| Field          | Type     | Description                              |
|----------------|----------|------------------------------------------|
| `name`         | `string` | Name of the detected disease             |
| `symptoms`     | `string` | Visual symptoms to look for              |
| `description`  | `string` | Detailed disease overview                |
| `prevention`   | `string` | Recommended prevention and treatment     |

---

### `GET /posts/disease`

Fetch community posts related to a specific disease.

**Query Parameters**

| Param     | Type     | Required | Description          |
|-----------|----------|----------|----------------------|
| `disease` | `string` | ✔        | Disease name to query |

**Example Request**

```
GET /posts/disease?disease=Late%20Blight
```

**Response `200 OK`**

```json
{
  "posts": [ ...Post[] ]
}
```

---

## Posts

> Requires Authentication

---

### `POST /posts`

Create a new community post with optional image file uploads.

**Content-Type:** `multipart/form-data`

**Form Fields**

| Field      | Type       | Required | Description                                  |
|------------|------------|----------|----------------------------------------------|
| `title`    | `string`   | ✔        | Post title                                   |
| `content`  | `string`   | ✔        | Post body content                            |
| `tags`     | `string[]` | ✔        | Tags — send each tag as a separate field     |
| `images`   | `file[]`   | ✘        | Image files (JPG / PNG / WEBP), multi-upload |

> ☢️ `tags` must be sent as **repeated form fields**, not a JSON array.
> `images` accepts **multiple files** under the same field name.
> like tags , "disease"
>      tags, "fungas"

**Response `201 Created`**

```json
{
  "message": "Post created",
  "post": { ...Post }
}
```

---

### `GET /posts`

Retrieve paginated community posts with optional search and tag filtering.

**Query Parameters**

| Param    | Type     | Required | Description                          |
|----------|----------|----------|--------------------------------------|
| `page`   | `number` | ✔        | Page number (starts at `1`)          |
| `limit`  | `number` | ✔        | Number of posts per page             |
| `search` | `string` | ✘        | Keyword search in title/content      |
| `tags`   | `string` | ✘        | Comma-separated tag filter           |

**Example Requests**

```
GET /posts?page=1&limit=10
GET /posts?page=1&limit=10&search=blight&tags=tomato,fungicide
```

**Response `200 OK`**

```json
{
  "posts": [ ...Post[] ],
  "page": 1,
  "limit": 10,
  "total": 84,
  "hasMore": true
}
```

---

### `GET /posts/me`

Retrieve the authenticated user's own posts (paginated).

**Query Parameters**

| Param   | Type     | Required | Description           |
|---------|----------|----------|-----------------------|
| `page`  | `number` | ✔        | Page number           |
| `limit` | `number` | ✔        | Posts per page        |

**Response `200 OK`**

```json
{
  "posts": [ ...Post[] ],
  "page": 1,
  "total": 23
}
```

---

### `GET /posts/:id`

Retrieve a single post by its ID.

**Path Parameters**

| Param | Type     | Description |
|-------|----------|-------------|
| `id`  | `string` | Post ID     |

**Response `200 OK`**

```json
{
  "post": { ...Post }
}
```

---

### `PATCH /posts/:id`

Update an existing post. All fields are optional — only send the fields you want to change.

**Content-Type:** `multipart/form-data`

**Path Parameters**

| Param | Type     | Description |
|-------|----------|-------------|
| `id`  | `string` | Post ID     |

**Form Fields**

| Field     | Type       | Required | Description                                  |
|-----------|------------|----------|----------------------------------------------|
| `title`   | `string`   | ✘        | Updated post title                           |
| `content` | `string`   | ✘        | Updated body content                         |
| `tags`    | `string[]` | ✘        | Updated tags — send each tag as a separate field |
| `images`  | `file[]`   | ✘        | Replacement image files (JPG / PNG / WEBP)   |

> ☢️ `tags` must be sent as **repeated form fields**, not a JSON array.
> Sending `images` will **replace** all existing images on the post.
> like tags , "disease"
>      tags, "fungas"


**Response `200 OK`**

```json
{
  "message": "Post updated"
}
```

---

### `DELETE /posts/:id`

Permanently delete a post.

**Path Parameters**

| Param | Type     | Description |
|-------|----------|-------------|
| `id`  | `string` | Post ID     |

**Response `200 OK`**

```json
{
  "message": "Post deleted"
}
```

---

## Likes & Dislikes

> 🔒 Requires Authentication

---

### `POST /posts/:id/like`

Like a post.

**Response `200 OK`**

```json
{
  "likes": 42
}
```

---

### `POST /posts/:id/dislike`

Dislike a post.

**Response `200 OK`**

```json
{
  "dislikes": 3
}
```

---

### `DELETE /posts/:id/like`

Remove a previously submitted like.

**Response `200 OK`**

```json
{}
```

---

### `DELETE /posts/:id/dislike`

Remove a previously submitted dislike.

**Response `200 OK`**

```json
{}
```

---

## Comments

> 🔒 Requires Authentication

---

### `POST /posts/:id/comments`

Add a comment to a post.

**Path Parameters**

| Param | Type     | Description |
|-------|----------|-------------|
| `id`  | `string` | Post ID     |

**Request Body**

| Field     | Type     | Required | Description      |
|-----------|----------|----------|------------------|
| `content` | `string` | ✔        | Comment text     |

```json
{
  "content": "I had the same issue — copper-based fungicide worked well for me."
}
```

**Response `201 Created`**

```json
{
  "comment": { ...Comment }
}
```

---

### `GET /posts/:id/comments`

Retrieve all comments for a post.

**Path Parameters**

| Param | Type     | Description |
|-------|----------|-------------|
| `id`  | `string` | Post ID     |

**Response `200 OK`**

```json
{
  "comments": [ ...Comment[] ]
}
```

---

### `DELETE /comments/:id`

Delete a comment by its ID.

**Path Parameters**

| Param | Type     | Description  |
|-------|----------|--------------|
| `id`  | `string` | Comment ID   |

**Response `200 OK`**

```json
{}
```

---

## Notifications

> 🔒 Requires Authentication

---

### `GET /notifications`

Retrieve all notifications for the authenticated user.

**Response `200 OK`**

```json
{
  "notifications": [ ...Notification[] ]
}
```

**Notification Types**

| Type       | Trigger                              |
|------------|--------------------------------------|
| `LIKE`     | Someone liked your post              |
| `DISLIKE`  | Someone disliked your post           |
| `COMMENT`  | Someone commented on your post       |

---

## Profile

> 🔒 Requires Authentication

---

### `GET /profile/me`

Retrieve the authenticated user's profile.

**Response `200 OK`**

```json
{
  "id": "usr_abc123",
  "name": "Dr. Jane Smith",
  "email": "expert@example.com",
  "role": "EXPERT"
}
```

---

### `PATCH /profile/me`

Update profile information. All fields are optional.

**Request Body**

| Field   | Type     | Required | Description          |
|---------|----------|----------|----------------------|
| `name`  | `string` | ✘        | Updated display name |
| `email` | `string` | ✘        | Updated email address |

```json
{
  "name": "Dr. Jane M. Smith",
  "email": "jane.smith@example.com"
}
```

**Response `200 OK`**

```json
{
  "message": "Profile updated"
}
```

---

### `GET /profile/activity`

Returns a summary of the user's activity on the platform.

**Response `200 OK`**

```json
{
  "postsCreated": 23,
  "commentsDone": 58
}
```

---

## Data Models

### `User`

```typescript
{
  id: string
  name: string
  email: string
  role: "FARMER" | "EXPERT"
}
```

---

### `Post`

```typescript
{
  id: string
  title: string
  content: string
  tags: string[]
  images?: string[]
  likes: number
  dislikes: number
  createdAt: string        // ISO 8601
  updatedAt: string        // ISO 8601
  author: User
}
```

---

### `Comment`

```typescript
{
  id: string
  content: string
  createdAt: string        // ISO 8601
  author: User
}
```

---

### `Notification`

```typescript
{
  id: string
  type: "LIKE" | "DISLIKE" | "COMMENT"
  message: string
  read: boolean
  createdAt: string        // ISO 8601
  triggeredBy: User
}
```

---

## HTTP Status Codes

| Code  | Meaning                                  |
|-------|------------------------------------------|
| `200` | OK — Request succeeded                   |
| `201` | Created — Resource successfully created  |
| `400` | Bad Request — Invalid input              |
| `401` | Unauthorized — Token missing or invalid  |
| `403` | Forbidden — Insufficient permissions     |
| `404` | Not Found — Resource does not exist      |
| `422` | Unprocessable Entity — Validation failed |
| `500` | Internal Server Error                    |

---
