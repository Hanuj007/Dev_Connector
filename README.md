# Dev_Connector - Backend Documentation

This is the backend for **Dev_Connector**, a developer networking platform built with the MERN stack (Node.js, Express.js, MongoDB, Mongoose).

The backend follows the **MVC (Model-View-Controller) + Repository Pattern**, keeping database queries isolated inside repositories, business logic inside services, and HTTP request handling inside controllers.

---

## 1. How to Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher).

Navigate to the `backend/` directory in your terminal and install packages:

```bash
cd backend
npm install
```

### Installed Packages:
- `express`: Fast, minimalist web framework for Node.js.
- `mongoose`: Object Data Modeling (ODM) library for MongoDB.
- `dotenv`: Loads environment variables from `.env` file into `process.env`.
- `cors`: Enables Cross-Origin Resource Sharing for frontend access.
- `bcryptjs`: Secure password hashing using salt and hash.
- `jsonwebtoken`: Creates and verifies JSON Web Tokens (JWT) for authentication.
- `axios`: HTTP client used to fetch public repository data from the GitHub REST API.
- `nodemon` (devDependencies): Auto-restarts the server during development on file changes.

---

## 2. How to Configure `.env`

Create or edit the `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/Dev_Connector
JWT_SECRET=dev_connector_super_secret_jwt_key_2026
GITHUB_API=https://api.github.com
```

- `PORT`: The port on which the Express server listens (default `5000`).
- `MONGO_URI`: MongoDB connection string pointing to the `Dev_Connector` database.
- `JWT_SECRET`: Secret key used to sign and verify JSON Web Tokens.
- `GITHUB_API`: Base URL for GitHub REST API (`https://api.github.com`).

---

## 3. How to Start MongoDB

Make sure MongoDB is running on your local machine:

### On macOS (Homebrew):
```bash
brew services start mongodb-community
```
Or run directly:
```bash
mongod --dbpath /usr/local/var/mongodb
```

### On Windows / Linux:
```bash
sudo systemctl start mongod
# or start the MongoDB service from Services manager
```

---

## 4. How to Start Backend

### Development Mode (with hot-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

> **Note for macOS users**: If you see `Error: listen EADDRINUSE :::5000`, macOS AirPlay Receiver is using port 5000. You can either:
> 1. Change `PORT=5001` in your `backend/.env` file.
> 2. Or disable AirPlay Receiver in **System Settings → General → AirDrop & AirPlay → AirPlay Receiver** (toggle Off).

When started successfully, you will see in the terminal:
```text
Server running in development mode on port 5000
MongoDB Connected: 127.0.0.1
Database Name: Dev_Connector
```

You can open `http://localhost:5000` in your browser to verify that the server is active:
```json
{
  "status": "success",
  "message": "Dev_Connector API is running..."
}
```

---

## 5. Database Collection Mapping

Mongoose models are explicitly configured to map to these 6 collections:

| Model | Collection Name | Purpose |
|---|---|---|
| `User` | `Users` | Stores user accounts, bio, skills, profile image |
| `Post` | `Posts` | Stores developer posts and user like IDs |
| `Follow` | `Follows` | Stores follower/following relationship pairs |
| `GithubRepository` | `githubRepositories` | Stores cached developer repositories |
| `Message` | `Messages` | Stores 1-on-1 direct chat messages |
| `Notification` | `Notifications` | Stores alerts for follows, likes, comments, messages |

---

## 6. API Quick Reference

- **Base URL:** `http://localhost:5000` (or `http://localhost:5001`)
- **Health Check:** `GET /`
- **Authentication:** `Authorization: Bearer <token>` required for all protected endpoints
- 📖 **Full API Documentation:** Detailed request/response payloads, JSON schemas, and step-by-step Postman testing sequences are located in [api.md](file:///Users/hanujtrivedi/Downloads/At_project/backend/api.md).

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Log in an existing user |
| `GET` | `/api/auth/me` | **Protected** | Get current logged-in user profile |

### 👤 Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Public | Get all developers |
| `GET` | `/api/users/:id` | Public | Get developer profile by ID |
| `PUT` | `/api/users/profile` | **Protected** | Update logged-in user profile |
| `DELETE` | `/api/users/profile` | **Protected** | Delete user account & cascade all user data |

### 📝 Posts (`/api/posts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/posts` | **Protected** | Create a new post |
| `GET` | `/api/posts` | Public | Get all posts (newest first) |
| `GET` | `/api/posts/:id` | Public | Get a single post by ID |
| `PUT` | `/api/posts/:id` | **Protected** | Update a post (owner only) |
| `DELETE` | `/api/posts/:id` | **Protected** | Delete a post (owner only) |
| `PUT` | `/api/posts/:id/like` | **Protected** | Like a post |
| `PUT` | `/api/posts/:id/unlike` | **Protected** | Unlike a post |

### 👥 Follow System (`/api/follows`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/follows/:userId` | **Protected** | Follow a developer |
| `DELETE` | `/api/follows/:userId` | **Protected** | Unfollow a developer |
| `GET` | `/api/follows/followers/:userId` | Public | Get followers list of a user |
| `GET` | `/api/follows/following/:userId` | Public | Get following list of a user |

### 🐙 GitHub API (`/api/github`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/github/:username` | Public | Fetch public repositories from GitHub |
| `GET` | `/api/github/repositories` | **Protected** | Fetch & sync logged-in user's GitHub repositories to database |

### 💬 Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/messages` | **Protected** | Send direct message to another developer |
| `GET` | `/api/messages/:userId` | **Protected** | Get chat history between logged-in user and `:userId` |
| `PUT` | `/api/messages/:id/read` | **Protected** | Mark message as read (receiver only) |
| `DELETE` | `/api/messages/:id` | **Protected** | Delete message (sender or receiver only) |

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | **Protected** | Get all notifications for logged-in user |
| `PUT` | `/api/notifications/read-all` | **Protected** | Mark all notifications as read |
| `PUT` | `/api/notifications/:id/read` | **Protected** | Mark single notification as read |
| `DELETE` | `/api/notifications/:id` | **Protected** | Delete a notification |

