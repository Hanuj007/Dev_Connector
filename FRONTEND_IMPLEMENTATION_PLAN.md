# Dev-Connector — Frontend Implementation Plan & Architecture Reference

This document serves as the implementation and architectural reference for the **Dev-Connector** frontend. It outlines the design language, API integration strategy, state management, routing, component hierarchy, and verification steps.

---

## 1. Project Safety & Boundaries

- **Backend Directory (`backend/`)**: STRICTLY UNTOUCHED.
- **Database & Collections**: MongoDB `Dev_Connector` (`Users`, `Posts`, `Follows`, `githubRepositories`, `Messages`, `Notifications`) untouched.
- **Matching Engine**: Existing rule-based engine in `backend/services/recommendationService.js` and `backend/controllers/recommendationController.js` untouched.
- **Backend Port**: `http://localhost:5001` (avoids macOS AirPlay port 5000 conflict).
- **Frontend Directory (`frontend/`)**: Fully isolated single-page application built with Vite + React 18 + React Router v6.

---

## 2. Design System & Visual Identity

### Creative Agency / Editorial Aesthetic (Reference: Dribbble Creative Agency)
- **Palette**:
  - Primary Canvas: `#FBF9F5` (warm cream paper)
  - Card / Secondary Canvas: `#F4EFEA` and pure `#FFFFFF` with warm undertones
  - Ink Typography: `#121212` (deep charcoal-black)
  - Secondary Typography: `#6E675F` (warm muted umber)
  - Accent Color: `#EB4A2A` (bold editorial vermilion / cadmium red)
  - Accent Hover: `#D4391A`
  - Subtle Hairlines: `1px solid #E5E0D8`
  - Technical Tag Pill Canvas: `#EFECE6` with text `#262624`
- **Typography**:
  - Headings: `Plus Jakarta Sans`, `Space Grotesk`, sans-serif (massive scale, tight tracking, editorial weight)
  - Body: `Inter`, system sans-serif (crisp legibility, balanced line height)
  - Code & Badges: `JetBrains Mono`, `Space Mono`, monospace
- **Core Principles**:
  - Strong typography and large editorial headlines (`WHERE DEVELOPERS CONNECT.`)
  - Generous whitespace and asymmetric balance
  - Crisp hairline borders, no heavy shadows
  - Restrained color application (warm neutrals with vermilion punctuation)
  - Smooth micro-interactions and reveals

---

## 3. Directory & File Structure

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env
├── public/
└── src/
    ├── index.css                <-- Design tokens, resets, typography, utility classes
    ├── App.jsx                  <-- Router setup & global shell
    ├── main.jsx                 <-- Entry point
    │
    ├── context/
    │   ├── AuthContext.jsx      <-- User auth, token storage, user hydration
    │   └── NotificationContext.jsx <-- Notification polling & unread badge
    │
    ├── api/
    │   ├── client.js            <-- Axios client with Bearer token interceptor
    │   ├── authApi.js           <-- Login, register, me
    │   ├── userApi.js           <-- Browse developers, profile by ID, update profile, delete account
    │   ├── recommendationApi.js <-- Developer recommendations, project recommendations, tech profile
    │   ├── postApi.js           <-- Feed, create post, like, unlike, delete
    │   ├── followApi.js         <-- Follow, unfollow, get followers/following
    │   ├── githubApi.js         <-- Fetch public repos, sync user repos
    │   ├── messageApi.js        <-- Conversation history, send message, mark read
    │   └── notificationApi.js   <-- Fetch notifications, mark read, mark all read
    │
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx       <-- Editorial brand wordmark, links, auth state
    │   │   ├── Footer.jsx       <-- Editorial footer with quick links & manifesto
    │   │   ├── TechPill.jsx     <-- Consistent tech badge
    │   │   ├── Modal.jsx        <-- Accessible modal dialog with backdrop blur
    │   │   ├── Toast.jsx        <-- Toast notifications container
    │   │   ├── Skeleton.jsx     <-- Content loading skeleton placeholders
    │   │   ├── EmptyState.jsx   <-- Clean empty state display
    │   │   └── ProtectedRoute.jsx <-- Route guard for authenticated views
    │   │
    │   ├── matching/
    │   │   ├── MatchCard.jsx    <-- Developer match card (score %, shared tech, reason)
    │   │   ├── ProjectMatchCard.jsx <-- Project match card (stars, forks, score, reason)
    │   │   └── InterestBreakdown.jsx <-- User's calculated technology affinity breakdown
    │   │
    │   ├── developers/
    │   │   ├── DeveloperCard.jsx <-- Discovery card with bio, skills, follow CTA
    │   │   └── DeveloperFilters.jsx <-- Search input & skill filter chips
    │   │
    │   ├── profile/
    │   │   ├── ProfileHeader.jsx <-- Large avatar, bio, stats, follow/message actions
    │   │   ├── RepoList.jsx     <-- GitHub repository list with sync button
    │   │   └── FollowModal.jsx  <-- Followers / Following list modal
    │   │
    │   ├── posts/
    │   │   ├── PostCard.jsx     <-- Post card with like count, author link, delete button
    │   │   └── CreatePostModal.jsx <-- Post creation modal
    │   │
    │   └── messages/
    │       ├── ConversationList.jsx <-- Active conversation list
    │       └── ChatWindow.jsx   <-- Chat thread and message sender
    │
    └── pages/
        ├── LandingPage.jsx      <-- Editorial agency hero, mission, featured developers
        ├── LoginPage.jsx        <-- Minimalist login
        ├── RegisterPage.jsx     <-- Registration form
        ├── DiscoverPage.jsx     <-- Search & filter developer community
        ├── MatchingPage.jsx     <-- Dedicated Matching Engine interface
        ├── CommunityPage.jsx    <-- Technical discussions & posts feed
        ├── ProfilePage.jsx      <-- Developer creative portfolio & GitHub repos
        ├── EditProfilePage.jsx  <-- Profile editor
        ├── MessagesPage.jsx     <-- Direct messaging split-screen
        ├── NotificationsPage.jsx<-- Notification alerts center
        └── NotFoundPage.jsx     <-- Editorial 404
```

---

## 4. API Endpoints Map

All frontend services target `http://localhost:5001`:

- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- **Users**: `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/profile`, `DELETE /api/users/profile`
- **Matching**: `GET /api/recommendations/developers`, `GET /api/recommendations/projects`, `GET /api/recommendations/profile`
- **Posts**: `GET /api/posts`, `POST /api/posts`, `PUT /api/posts/:id/like`, `PUT /api/posts/:id/unlike`, `DELETE /api/posts/:id`
- **Follows**: `POST /api/follows/:userId`, `DELETE /api/follows/:userId`, `GET /api/follows/followers/:userId`, `GET /api/follows/following/:userId`
- **GitHub**: `GET /api/github/:username`, `GET /api/github/repositories`
- **Messages**: `GET /api/messages/:userId`, `POST /api/messages`, `PUT /api/messages/:id/read`, `DELETE /api/messages/:id`
- **Notifications**: `GET /api/notifications`, `PUT /api/notifications/:id/read`, `PUT /api/notifications/read-all`, `DELETE /api/notifications/:id`
