# Dev_Connector - API Documentation

Comprehensive REST API documentation for the **Dev_Connector** platform, covering authentication, user profiles, posts, social follow system, GitHub repository integration, direct messaging, notifications, request/response examples, and testing workflows.

---

## Table of Contents
1. [Base Information & Health Check](#1-base-information--health-check)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [API Endpoints Summary](#3-api-endpoints-summary)
4. [Endpoint Reference & Specifications](#4-endpoint-reference--specifications)
   - [Authentication API (`/api/auth`)](#-authentication-api-apiauth)
   - [Users API (`/api/users`)](#-users-api-apiusers)
   - [Posts API (`/api/posts`)](#-posts-api-apiposts)
   - [Follow System API (`/api/follows`)](#-follow-system-api-apifollows)
   - [GitHub API (`/api/github`)](#-github-api-apigithub)
   - [Messages API (`/api/messages`)](#-messages-api-apimessages)
   - [Notifications API (`/api/notifications`)](#-notifications-api-apinotifications)
   - [Recommendations API (`/api/recommendations`)](#-recommendations-api-apirecommendations)
5. [Quick Request Bodies Reference](#5-quick-request-bodies-reference)
6. [Step-by-Step Postman Testing Sequence](#6-step-by-step-postman-testing-sequence)
7. [Error Handling & Status Codes](#7-error-handling--status-codes)

---

## 1. Base Information & Health Check

- **Base URL**: `http://localhost:5000` (or `http://localhost:5001` if port 5000 is occupied by macOS AirPlay)
- **Content-Type**: `application/json`
- **Default Database**: MongoDB (`Dev_Connector`)

### Health Check Endpoint
Verify that the backend server is active and running.

- **Method:** `GET`
- **Endpoint:** `/`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "status": "success",
    "message": "Dev_Connector API is running..."
  }
  ```

---

## 2. Authentication & Authorization

Protected endpoints require a JSON Web Token (JWT) passed in the HTTP `Authorization` request header formatted as a **Bearer** token:

```http
Authorization: Bearer <your_jwt_token_here>
```

### In Postman:
1. Go to the **Headers** tab.
2. Add Key: `Authorization`
3. Add Value: `Bearer <token>`
*(Alternatively, navigate to **Auth** tab → Type: **Bearer Token** → Paste your token).*

If the header is missing, malformed, or the token is expired/invalid, the server returns:
```json
{
  "message": "Not authorized, no token provided"
}
```
or
```json
{
  "message": "Not authorized, token invalid or expired"
}
```

---

## 3. API Endpoints Summary

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Log in existing user and receive JWT |
| `GET` | `/api/auth/me` | **Protected** | Retrieve profile of currently authenticated user |

### 👤 Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Public | Retrieve all developer profiles |
| `GET` | `/api/users/:id` | Public | Retrieve a developer profile by ID |
| `PUT` | `/api/users/profile` | **Protected** | Update current user's profile |
| `DELETE` | `/api/users/profile` | **Protected** | Delete user account & cascade-delete related records |

### 📝 Posts (`/api/posts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/posts` | **Protected** | Create a new discussion post |
| `GET` | `/api/posts` | Public | Retrieve all posts sorted newest first |
| `GET` | `/api/posts/:id` | Public | Retrieve a single post by ID |
| `PUT` | `/api/posts/:id` | **Protected** | Update a post (owner only) |
| `DELETE` | `/api/posts/:id` | **Protected** | Delete a post (owner only) |
| `PUT` | `/api/posts/:id/like` | **Protected** | Like a post |
| `PUT` | `/api/posts/:id/unlike` | **Protected** | Unlike a post |

### 👥 Follow System (`/api/follows`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/follows/:userId` | **Protected** | Follow a developer |
| `DELETE` | `/api/follows/:userId` | **Protected** | Unfollow a developer |
| `GET` | `/api/follows/followers/:userId` | Public | Get followers of a user |
| `GET` | `/api/follows/following/:userId` | Public | Get users followed by a user |

### 🐙 GitHub API (`/api/github`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/github/:username` | Public | Fetch public repositories directly from GitHub |
| `GET` | `/api/github/repositories` | **Protected** | Sync logged-in user's GitHub repositories to database |

### 💬 Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/messages` | **Protected** | Send direct message to a developer |
| `GET` | `/api/messages/:userId` | **Protected** | Retrieve 1-on-1 chat history with another user |
| `PUT` | `/api/messages/:id/read` | **Protected** | Mark message as read (receiver only) |
| `DELETE` | `/api/messages/:id` | **Protected** | Delete message (sender or receiver only) |

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | **Protected** | Retrieve notifications for current user |
| `PUT` | `/api/notifications/read-all` | **Protected** | Mark all user notifications as read |
| `PUT` | `/api/notifications/:id/read` | **Protected** | Mark a single notification as read |
| `DELETE` | `/api/notifications/:id` | **Protected** | Delete a notification |

### 🧠 Recommendations (`/api/recommendations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/recommendations/developers` | **Protected** | Get recommended developers by technology interest |
| `GET` | `/api/recommendations/projects` | **Protected** | Get recommended projects by tech stack similarity |
| `GET` | `/api/recommendations/profile` | **Protected** | Get current user's computed technology interest profile |


---

## 4. Endpoint Reference & Specifications

### 🔐 Authentication API (`/api/auth`)

#### 1. Register User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Aman Sharma",
    "email": "aman@example.com",
    "password": "password123",
    "username": "amansharma"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "username": "amansharma",
      "bio": "",
      "skills": [],
      "githubUsername": "",
      "profileImage": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 2. Login User
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "aman@example.com",
    "password": "password123"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "username": "amansharma",
      "bio": "",
      "skills": [],
      "githubUsername": "",
      "profileImage": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 3. Get Current User Profile
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "username": "amansharma",
      "bio": "",
      "skills": [],
      "githubUsername": "",
      "profileImage": "",
      "createdAt": "2026-03-25T08:00:00.000Z",
      "updatedAt": "2026-03-25T08:00:00.000Z"
    }
  }
  ```

---

### 👤 Users API (`/api/users`)

#### 1. Get All Developers
- **URL:** `/api/users`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "count": 2,
    "users": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Aman Sharma",
        "username": "amansharma",
        "bio": "Full-stack developer",
        "skills": ["JavaScript", "React", "Node.js"]
      }
    ]
  }
  ```

#### 2. Get Developer by ID
- **URL:** `/api/users/:id`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "username": "amansharma",
      "bio": "Full-stack developer",
      "skills": ["JavaScript", "React", "Node.js"],
      "githubUsername": "octocat",
      "profileImage": ""
    }
  }
  ```

#### 3. Update User Profile
- **URL:** `/api/users/profile`
- **Method:** `PUT`
- **Access:** Protected (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "bio": "Full-stack MERN developer passionate about open source",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    "githubUsername": "octocat",
    "profileImage": "https://example.com/images/aman.jpg"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "username": "amansharma",
      "bio": "Full-stack MERN developer passionate about open source",
      "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
      "githubUsername": "octocat",
      "profileImage": "https://example.com/images/aman.jpg"
    }
  }
  ```

#### 4. Delete User Profile (Cascade)
- **URL:** `/api/users/profile`
- **Method:** `DELETE`
- **Access:** Protected (`Bearer <token>`)
- **Description:** Deletes the user account and automatically cascade-deletes all associated posts, follows, messages, notifications, and cached GitHub repositories.
- **Response (`200 OK`):**
  ```json
  {
    "message": "User account and all associated data deleted successfully"
  }
  ```

---

### 📝 Posts API (`/api/posts`)

#### 1. Create Post
- **URL:** `/api/posts`
- **Method:** `POST`
- **Access:** Protected (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "text": "Hello world! Excited to join Dev_Connector and connect with fellow developers."
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "message": "Post created successfully",
    "post": {
      "_id": "65f2b3c4d5e6f7a8b9c0d1e2",
      "user": "65f1a2b3c4d5e6f7a8b9c0d1",
      "text": "Hello world! Excited to join Dev_Connector and connect with fellow developers.",
      "likes": [],
      "createdAt": "2026-03-25T08:30:00.000Z",
      "updatedAt": "2026-03-25T08:30:00.000Z"
    }
  }
  ```

#### 2. Get All Posts
- **URL:** `/api/posts`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "count": 1,
    "posts": [
      {
        "_id": "65f2b3c4d5e6f7a8b9c0d1e2",
        "user": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "Aman Sharma",
          "username": "amansharma",
          "profileImage": ""
        },
        "text": "Hello world! Excited to join Dev_Connector and connect with fellow developers.",
        "likes": [],
        "createdAt": "2026-03-25T08:30:00.000Z"
      }
    ]
  }
  ```

#### 3. Get Post by ID
- **URL:** `/api/posts/:id`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "post": {
      "_id": "65f2b3c4d5e6f7a8b9c0d1e2",
      "user": {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Aman Sharma",
        "username": "amansharma"
      },
      "text": "Hello world! Excited to join Dev_Connector...",
      "likes": []
    }
  }
  ```

#### 4. Update Post
- **URL:** `/api/posts/:id`
- **Method:** `PUT`
- **Access:** Protected (Post owner only)
- **Request Body:**
  ```json
  {
    "text": "Hello world! Updated my first discussion post."
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Post updated successfully",
    "post": {
      "_id": "65f2b3c4d5e6f7a8b9c0d1e2",
      "text": "Hello world! Updated my first discussion post."
    }
  }
  ```

#### 5. Delete Post
- **URL:** `/api/posts/:id`
- **Method:** `DELETE`
- **Access:** Protected (Post owner only)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

#### 6. Like Post
- **URL:** `/api/posts/:id/like`
- **Method:** `PUT`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Post liked successfully",
    "likes": ["65f1a2b3c4d5e6f7a8b9c0d1"]
  }
  ```

#### 7. Unlike Post
- **URL:** `/api/posts/:id/unlike`
- **Method:** `PUT`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Post unliked successfully",
    "likes": []
  }
  ```

---

### 👥 Follow System API (`/api/follows`)

#### 1. Follow a Developer
- **URL:** `/api/follows/:userId`
- **Method:** `POST`
- **Access:** Protected (`Bearer <token>`)
- **Response (`201 Created`):**
  ```json
  {
    "message": "Successfully followed developer",
    "follow": {
      "_id": "65f3c4d5e6f7a8b9c0d1e2f3",
      "follower": "65f1a2b3c4d5e6f7a8b9c0d1",
      "following": "65f1a2b3c4d5e6f7a8b9c0d2",
      "createdAt": "2026-03-25T08:45:00.000Z"
    }
  }
  ```

#### 2. Unfollow a Developer
- **URL:** `/api/follows/:userId`
- **Method:** `DELETE`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Successfully unfollowed developer"
  }
  ```

#### 3. Get Followers List
- **URL:** `/api/follows/followers/:userId`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "count": 1,
    "followers": [
      {
        "_id": "65f3c4d5e6f7a8b9c0d1e2f3",
        "follower": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "Aman Sharma",
          "username": "amansharma",
          "profileImage": ""
        }
      }
    ]
  }
  ```

#### 4. Get Following List
- **URL:** `/api/follows/following/:userId`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "count": 1,
    "following": [
      {
        "_id": "65f3c4d5e6f7a8b9c0d1e2f3",
        "following": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
          "name": "Priya Patel",
          "username": "priyapatel",
          "profileImage": ""
        }
      }
    ]
  }
  ```

#### 5. Check Follow Status
- **URL:** `/api/follows/status/:userId`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "isFollowing": true,
    "isSelf": false
  }
  ```

---

### 🐙 GitHub API (`/api/github`)

#### 1. Fetch Public Repositories by Username
- **URL:** `/api/github/:username`
- **Method:** `GET`
- **Access:** Public
- **Response (`200 OK`):**
  ```json
  {
    "count": 5,
    "repositories": [
      {
        "name": "Dev_Connector",
        "html_url": "https://github.com/octocat/Dev_Connector",
        "description": "Developer social networking application",
        "stargazers_count": 42,
        "forks_count": 7,
        "language": "JavaScript"
      }
    ]
  }
  ```

#### 2. Sync Logged-in User's Repositories
- **URL:** `/api/github/repositories`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Note:** Requires `githubUsername` to be set in user's profile first.
- **Response (`200 OK`):**
  ```json
  {
    "message": "GitHub repositories synced and stored successfully",
    "count": 5,
    "repositories": [
      {
        "_id": "65f4d5e6f7a8b9c0d1e2f3a4",
        "user": "65f1a2b3c4d5e6f7a8b9c0d1",
        "repoName": "Dev_Connector",
        "repoUrl": "https://github.com/octocat/Dev_Connector",
        "description": "Developer social networking application",
        "stars": 42,
        "forks": 7,
        "language": "JavaScript"
      }
    ]
  }
  ```

---

### 💬 Messages API (`/api/messages`)

#### 1. Send Message
- **URL:** `/api/messages`
- **Method:** `POST`
- **Access:** Protected (`Bearer <token>`)
- **Authorization Rule:** Current user **must follow** the receiver. If not following, returns `403 Forbidden`: `{"message": "You can only message users you follow."}`
- **Request Body:**
  ```json
  {
    "receiver": "65f1a2b3c4d5e6f7a8b9c0d2",
    "text": "Hi Priya! Loved your recent post about Node.js."
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "message": "Message sent successfully",
    "data": {
      "_id": "65f5e6f7a8b9c0d1e2f3a4b5",
      "sender": "65f1a2b3c4d5e6f7a8b9c0d1",
      "receiver": "65f1a2b3c4d5e6f7a8b9c0d2",
      "text": "Hi Priya! Loved your recent post about Node.js.",
      "isRead": false,
      "createdAt": "2026-03-25T09:00:00.000Z"
    }
  }
  ```
- **Error Response (`403 Forbidden`):**
  ```json
  {
    "message": "You can only message users you follow."
  }
  ```

#### 2. Check Messaging Permission
- **URL:** `/api/messages/permission/:userId`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "canMessage": true,
    "isFollowing": true,
    "isSelf": false,
    "message": "Messaging allowed"
  }
  ```

#### 3. Get Conversation
- **URL:** `/api/messages/:userId`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "count": 1,
    "messages": [
      {
        "_id": "65f5e6f7a8b9c0d1e2f3a4b5",
        "sender": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "Aman Sharma",
          "username": "amansharma"
        },
        "receiver": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
          "name": "Priya Patel",
          "username": "priyapatel"
        },
        "text": "Hi Priya! Loved your recent post about Node.js.",
        "isRead": false,
        "createdAt": "2026-03-25T09:00:00.000Z"
      }
    ]
  }
  ```

#### 3. Mark Message as Read
- **URL:** `/api/messages/:id/read`
- **Method:** `PUT`
- **Access:** Protected (Receiver only)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Message marked as read",
    "data": {
      "_id": "65f5e6f7a8b9c0d1e2f3a4b5",
      "isRead": true
    }
  }
  ```

#### 4. Delete Message
- **URL:** `/api/messages/:id`
- **Method:** `DELETE`
- **Access:** Protected (Sender or Receiver only)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Message deleted successfully"
  }
  ```

---

### 🔔 Notifications API (`/api/notifications`)

#### 1. Get All Notifications
- **URL:** `/api/notifications`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "count": 2,
    "notifications": [
      {
        "_id": "65f6f7a8b9c0d1e2f3a4b5c6",
        "user": "65f1a2b3c4d5e6f7a8b9c0d2",
        "sender": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "Aman Sharma",
          "username": "amansharma"
        },
        "type": "follow",
        "message": "Aman Sharma started following you",
        "isRead": false,
        "createdAt": "2026-03-25T08:45:00.000Z"
      }
    ]
  }
  ```

#### 2. Mark All Notifications as Read
- **URL:** `/api/notifications/read-all`
- **Method:** `PUT`
- **Access:** Protected (`Bearer <token>`)
- **Response (`200 OK`):**
  ```json
  {
    "message": "All notifications marked as read"
  }
  ```

#### 3. Mark Single Notification as Read
- **URL:** `/api/notifications/:id/read`
- **Method:** `PUT`
- **Access:** Protected (Notification owner only)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Notification marked as read",
    "notification": {
      "_id": "65f6f7a8b9c0d1e2f3a4b5c6",
      "isRead": true
    }
  }
  ```

#### 4. Delete Notification
- **URL:** `/api/notifications/:id`
- **Method:** `DELETE`
- **Access:** Protected (Notification owner only)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Notification deleted successfully"
  }
  ```

---

### 🧠 Recommendations API (`/api/recommendations`)

#### 1. Get Recommended Developers
- **URL:** `/api/recommendations/developers` *(also accessible via `/api/users/recommendations/developers`)*
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Query Parameters:**
  - `limit` *(optional, integer, default: 10, max: 50)*: Maximum number of recommendations to return
  - `minScore` *(optional, integer, default: 1)*: Minimum similarity percentage threshold (0-100)
- **Description:** Calculates technology stack similarity between the authenticated user and other developers using Weighted Jaccard Similarity. Returns ranked developers with matching technologies and explainable reason. Excludes the current user automatically.
- **Response (`200 OK`):**
  ```json
  {
    "count": 1,
    "developers": [
      {
        "userId": "65f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Priya Patel",
        "username": "priyapatel",
        "bio": "MERN Stack Engineer & Open Source Contributor",
        "profileImage": "",
        "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
        "matchScore": 87,
        "matchingTechnologies": [
          "React",
          "Node.js",
          "MongoDB"
        ],
        "reason": "You both have strong interests in React, Node.js, and MongoDB."
      }
    ]
  }
  ```

#### 2. Get Recommended Projects
- **URL:** `/api/recommendations/projects` *(also accessible via `/api/users/recommendations/projects`)*
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Query Parameters:**
  - `limit` *(optional, integer, default: 10, max: 50)*: Maximum number of recommendations to return
  - `minScore` *(optional, integer, default: 1)*: Minimum match percentage threshold (0-100)
- **Description:** Matches projects against the current user's computed technology interest profile (inferred from skills, repositories, created posts, liked posts, and interactions). Computes interest strength and project stack coverage. Automatically excludes projects authored by the current user.
- **Response (`200 OK`):**
  ```json
  {
    "count": 1,
    "projects": [
      {
        "projectId": "65f4d5e6f7a8b9c0d1e2f3a4",
        "projectName": "mern-social-network",
        "description": "Connect developers using React and Node.js backend",
        "language": "JavaScript",
        "htmlUrl": "https://github.com/priya/mern-social-network",
        "stars": 45,
        "forks": 10,
        "author": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
          "name": "Priya Patel",
          "username": "priyapatel"
        },
        "matchScore": 86,
        "matchingTechnologies": [
          "React",
          "Node.js",
          "MongoDB"
        ],
        "reason": "Recommended because you frequently interact with React, Node.js, and MongoDB projects."
      }
    ]
  }
  ```

#### 3. View Current User Technology Interest Profile
- **URL:** `/api/recommendations/profile`
- **Method:** `GET`
- **Access:** Protected (`Bearer <token>`)
- **Description:** Inspect the current user's dynamically computed technology interest profile. Displays technologies and their calculated interest scores derived from explicit skills (+10), own projects (+15), created posts (+10), liked posts (+5), and recency weighting.
- **Response (`200 OK`):**
  ```json
  {
    "userId": "65f1a2b3c4d5e6f7a8b9c0d1",
    "profile": {
      "React": 51,
      "Node.js": 42,
      "MongoDB": 38,
      "JavaScript": 51,
      "Python": 10
    }
  }
  ```

---

## 5. Quick Request Bodies Reference


### 1. Register User
```json
POST /api/auth/register
{
  "name": "Aman Sharma",
  "email": "aman@example.com",
  "password": "password123",
  "username": "amansharma"
}
```

### 2. Login User
```json
POST /api/auth/login
{
  "email": "aman@example.com",
  "password": "password123"
}
```

### 3. Update Profile
```json
PUT /api/users/profile
{
  "bio": "Full-stack MERN developer passionate about open source",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
  "githubUsername": "octocat",
  "profileImage": "https://example.com/images/aman.jpg"
}
```

### 4. Create Post
```json
POST /api/posts
{
  "text": "Hello world! Excited to join Dev_Connector and connect with fellow developers."
}
```

### 5. Update Post
```json
PUT /api/posts/:id
{
  "text": "Hello world! Updated my first discussion post."
}
```

### 6. Send Message
```json
POST /api/messages
{
  "receiver": "65f1a2b3c4d5e6f7a8b9c0d2",
  "text": "Hi Priya! Loved your recent post about Node.js."
}
```

---

## 6. Step-by-Step Postman Testing Sequence

Follow this exact sequential workflow to test every feature of the Dev_Connector API:

### Step 1: Register Developer 1
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Aman Sharma",
    "email": "aman@example.com",
    "password": "password123",
    "username": "amansharma"
  }
  ```
- **Expect:** `201 Created` with user info and `token`.

### Step 2: Login Developer 1
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "aman@example.com",
    "password": "password123"
  }
  ```
- **Expect:** `200 OK` with user details and `token`.

### Step 3: Copy JWT Token
- Copy the `token` string returned in Step 2.
- In Postman, add header: `Authorization: Bearer <token>` for all subsequent protected requests.

### Step 4: GET `/api/auth/me`
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Expect:** `200 OK` with logged-in user profile (password excluded).

### Step 5: Update Profile
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/users/profile`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "bio": "Full-stack developer building MERN applications",
    "skills": ["React", "Node.js", "Express", "MongoDB"],
    "githubUsername": "octocat"
  }
  ```
- **Expect:** `200 OK` with updated profile.

### Step 6: Create Post
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "text": "Building a college networking platform using MVC + Repository pattern!"
  }
  ```
- **Expect:** `201 Created` with post details. Note the returned `_id`.

### Step 7: Get All Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts`
- **Expect:** `200 OK` with array of posts sorted newest first with populated author info.

### Step 8: Like / Unlike Post
- **Like Post:**
  - **Method:** `PUT`
  - **URL:** `http://localhost:5000/api/posts/<post_id>/like`
  - **Headers:** `Authorization: Bearer <token>`
  - **Expect:** `200 OK` with updated likes array.
- **Unlike Post:**
  - **Method:** `PUT`
  - **URL:** `http://localhost:5000/api/posts/<post_id>/unlike`
  - **Headers:** `Authorization: Bearer <token>`
  - **Expect:** `200 OK` with user removed from likes array.

### Step 9: Follow / Unfollow User
1. Register a second user (Developer 2, e.g. `priya@example.com`), copy Developer 2's `_id`.
2. **Follow Developer 2:**
   - **Method:** `POST`
   - **URL:** `http://localhost:5000/api/follows/<developer_2_id>`
   - **Headers:** `Authorization: Bearer <token_of_developer_1>`
   - **Expect:** `201 Created`.
3. **Check Followers of Developer 2:**
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/api/follows/followers/<developer_2_id>`
   - **Expect:** `200 OK` listing Developer 1.
4. **Unfollow Developer 2:**
   - **Method:** `DELETE`
   - **URL:** `http://localhost:5000/api/follows/<developer_2_id>`
   - **Headers:** `Authorization: Bearer <token_of_developer_1>`
   - **Expect:** `200 OK`.

### Step 10: GitHub API Integration
- **Fetch Public Repositories of any GitHub User:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/github/octocat`
  - **Expect:** `200 OK` with public repo list from GitHub.
- **Sync Logged-in User Repositories to Database:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/github/repositories`
  - **Headers:** `Authorization: Bearer <token>`
  - **Expect:** `200 OK` with cached repositories stored in `githubRepositories` collection.

### Step 11: Send Direct Message
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/messages`
- **Headers:**
  - `Authorization: Bearer <token_of_developer_1>`
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "receiver": "<developer_2_id>",
    "text": "Hi Priya, lets collaborate on the final year project!"
  }
  ```
- **Expect:** `201 Created`.

### Step 12: Read & Manage Message
- **Get Conversation:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/messages/<developer_2_id>`
  - **Headers:** `Authorization: Bearer <token>`
  - **Expect:** `200 OK` with chronological chat messages.
- **Mark as Read:**
  - **Method:** `PUT`
  - **URL:** `http://localhost:5000/api/messages/<message_id>/read`
  - **Headers:** `Authorization: Bearer <token_of_receiver>`
  - **Expect:** `200 OK` with `isRead: true`.

### Step 13: Get & Manage Notifications
- Log in as Developer 2 (who received likes, follows, or messages).
- **Get Notifications:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/notifications`
  - **Headers:** `Authorization: Bearer <token_of_developer_2>`
  - **Expect:** `200 OK` with notifications list.
- **Mark All as Read:**
  - **Method:** `PUT`
  - **URL:** `http://localhost:5000/api/notifications/read-all`
  - **Headers:** `Authorization: Bearer <token_of_developer_2>`
  - **Expect:** `200 OK`.

### Step 14: Test Developer & Project Recommendations
- **Get Recommended Developers:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/recommendations/developers?limit=5`
  - **Headers:** `Authorization: Bearer <token_of_developer_1>`
  - **Expect:** `200 OK` with ranked developers, percentage `matchScore`, `matchingTechnologies`, and explainable `reason`.
- **Get Recommended Projects:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/recommendations/projects?limit=5`
  - **Headers:** `Authorization: Bearer <token_of_developer_1>`
  - **Expect:** `200 OK` with ranked projects, `matchScore`, `matchingTechnologies`, and `reason` (author's own projects excluded).
- **Inspect Computed Technology Interest Profile:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5000/api/recommendations/profile`
  - **Headers:** `Authorization: Bearer <token_of_developer_1>`
  - **Expect:** `200 OK` with current user's dynamically weighted technology interest scores.

---


## 7. Error Handling & Status Codes

All errors return JSON with a descriptive `message` property:

```json
{
  "message": "Error description here"
}
```

### Common HTTP Status Codes:
| Status Code | Meaning | Example Cause |
|---|---|---|
| `200 OK` | Success | GET, PUT, or DELETE request completed |
| `201 Created` | Resource Created | User registered, post created, message sent, user followed |
| `400 Bad Request` | Invalid Input | Missing required fields, invalid input, already following |
| `401 Unauthorized` | Auth Failure | Missing token, invalid token, or expired token |
| `403 Forbidden` | Access Denied | Editing someone else's post, marking other's message as read |
| `404 Not Found` | Not Found | Invalid ObjectId format, route doesn't exist, user not found |
| `500 Server Error` | Internal Error | Database connection drop, unexpected server failure |
