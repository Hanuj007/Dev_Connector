# Dev-Connector — Developer Recommendation Engine

## 1. Overview

The Developer Recommendation Engine is a recommendation feature for **Dev-Connector** that suggests:

1. **Developers to connect with** based on similar technology interests.
2. **Projects the current developer may be interested in** based on their technology interests and previous project interactions.

The engine is intentionally designed as a **simple, explainable, rule-based recommendation system**. It does not require machine learning, external AI APIs, embeddings, or a separate recommendation service.

The core idea is:

```text
User Profile + Projects + Likes/Reactions + Comments
                    ↓
          Technology Interest Profile
                    ↓
          Technology Similarity
                    ↓
          Recommendation Score
                    ↓
       Developer / Project Suggestions
```

---

# 2. Goals

## Primary Goals

- Identify technologies a developer is interested in.
- Learn interests from both explicit information and actual behavior.
- Find developers with similar technology interests.
- Recommend projects relevant to the user's interests.
- Provide a meaningful match percentage.
- Explain why a developer/project was recommended.
- Reuse the existing backend architecture and database.
- Keep the implementation simple enough for a B.Tech academic project.

## Non-Goals

The first version should NOT introduce:

- Machine Learning
- Neural Networks
- Embeddings
- Vector databases
- OpenAI/LLM APIs
- Python recommendation services
- Redis
- Kafka
- Microservices
- Complex background processing

---

# 3. Existing Backend Must Be Preserved

The existing Dev-Connector backend is already implemented and working.

The recommendation engine must be added incrementally.

### Important rules

- Do not rewrite existing backend code.
- Do not rename existing entities.
- Do not rename existing controllers.
- Do not rename existing repositories.
- Do not change existing routes unnecessarily.
- Do not change authentication.
- Do not break existing CRUD APIs.
- Reuse existing entities and relationships.
- Reuse the existing DbContext.
- Reuse existing repositories and services where possible.
- Avoid creating duplicate entities/tables.
- Do not reset or recreate the database.
- Do not modify unrelated code.
- Make the smallest reasonable changes required.

---

# 4. Recommendation Sources

A developer's technology interest is derived from several signals.

## 4.1 Explicit User Technologies

Technologies directly associated with the user are a strong signal.

Example:

```text
React
Node.js
MongoDB
Python
```

Starting contribution:

```text
Explicit technology = +10
```

---

## 4.2 Technologies Used in Own Projects

If the user creates a project using a technology, this is a stronger behavioral signal.

Example:

```text
Project:
AI Resume Analyzer

Technologies:
React
Node.js
MongoDB
```

Contribution:

```text
Technology used in own project = +15
```

---

## 4.3 Liked/Reacted Projects

If a user likes or reacts to a project, inspect the technologies used by that project.

Example:

```text
User likes:
Project A → React + Node
Project B → React + MongoDB
```

The user's React interest should increase.

Contribution:

```text
Liked/reacted project technology = +5
```

---

## 4.4 Comments

Commenting indicates stronger engagement than simply viewing a project.

If a user comments on a project, its technologies contribute to the user's interest profile.

Contribution:

```text
Commented project technology = +8
```

---

## 4.5 Repeated Interaction

Repeated interaction with the same technology should increase its importance.

Example:

```text
User likes 1 React project
        ↓
Small React interest

User likes 5 React projects
        ↓
Much stronger React interest
```

The implementation should naturally accumulate contributions from multiple interactions.

---

# 5. Initial Weight System

Use these starting weights:

| Activity | Weight |
|---|---:|
| Technology explicitly listed by user | +10 |
| Technology used in user's own project | +15 |
| Liked/reacted project technology | +5 |
| Commented project technology | +8 |

These values should be centralized rather than duplicated throughout the code.

For example:

```text
ProfileSkillWeight = 10
OwnProjectWeight = 15
LikeWeight = 5
CommentWeight = 8
```

The values can later be tuned without rewriting the recommendation logic.

---

# 6. Technology Interest Profile

The engine builds an internal technology profile for every user.

Example:

```text
User: Rahul

React       = 85
Node.js     = 75
MongoDB     = 65
Python      = 30
Java        = 10
```

The score represents the user's relative interest in each technology.

A permanent `UserInterestProfile` database table is not required for the first version.

Prefer calculating the profile dynamically from existing data.

This avoids unnecessary database complexity and keeps the implementation synchronized with current user activity.

---

# 7. Interest Profile Calculation

Conceptually:

```text
InterestScore(Technology)
=
ExplicitTechnologyScore
+
OwnProjectScore
+
LikeScore
+
CommentScore
```

Example:

```text
React

Explicit skill       +10
Project 1            +15
Project 2            +15
Liked Project 1       +5
Liked Project 2       +5
Commented Project     +8
-------------------------
Total                 58
```

Scores may be capped at 100:

```text
FinalScore = min(100, CalculatedScore)
```

If capping is used, apply it consistently.

---

# 8. Optional Recency Factor

Recent interactions should have slightly more influence than very old interactions.

A simple approach can be used:

```text
Activity < 7 days       → 1.0
7–30 days               → 0.8
30–90 days              → 0.5
> 90 days               → 0.2
```

Then:

```text
Adjusted Contribution
=
Base Weight × Recency Factor
```

Example:

```text
Like weight = 5

Recent like:
5 × 1.0 = 5

Older like:
5 × 0.5 = 2.5
```

This feature is optional for the first implementation. If it makes the existing code unnecessarily complicated, the initial version can use simple cumulative weights.

---

# 9. Developer Matching

The engine compares the technology profiles of two developers.

Example:

### User A

```text
React       = 80
Node.js     = 70
MongoDB     = 60
Python      = 20
```

### User B

```text
React       = 75
Node.js     = 80
MongoDB     = 55
Java        = 20
```

Common technologies:

```text
React
Node.js
MongoDB
```

The matching algorithm should:

1. Get the relevant technologies for both users.
2. Find overlapping technologies.
3. Compare the interest strengths.
4. Calculate a similarity score.
5. Normalize it to 0–100.
6. Return recommendations ordered by match score.

---

# 10. Simple Developer Similarity Formula

A simple explainable formula can be used.

For every technology common to both users:

```text
CommonContribution
=
min(UserAInterest, UserBInterest)
```

Example:

```text
React       → min(80,75) = 75
Node.js     → min(70,80) = 70
MongoDB     → min(60,55) = 55

Total = 200
```

Normalize this against the combined technology interest of the users.

The exact normalization can be implemented in a simple, consistent way that produces:

```text
0–100
```

where:

```text
0   = no meaningful similarity
100 = extremely similar technology interests
```

The score is a recommendation similarity score, not a prediction of user behavior.

---

# 11. Developer Recommendation Flow

```text
Current User
     ↓
Get User Technologies
     ↓
Get User Projects
     ↓
Get User Likes/Reactions
     ↓
Get User Comments
     ↓
Extract Technologies from Activities
     ↓
Calculate Technology Interest Scores
     ↓
Build User Interest Profile
     ↓
Build Interest Profiles for Candidate Developers
     ↓
Compare Technology Profiles
     ↓
Calculate Match Score
     ↓
Remove Current User
     ↓
Remove Duplicates
     ↓
Sort by Match Score
     ↓
Return Recommended Developers
```

---

# 12. Developer Recommendation Response

Conceptually:

```json
{
  "userId": 5,
  "name": "Rahul",
  "matchScore": 87,
  "matchingTechnologies": [
    "React",
    "Node.js"
  ],
  "reason": "You have strong interest in similar technologies."
}
```

Property names should follow the existing project's DTO naming conventions.

---

# 13. Recommendation Explanation

Every recommendation should provide a meaningful reason based on actual matching data.

Examples:

```text
You both have strong interests in React and Node.js.
```

or:

```text
You frequently interact with React and Node.js projects.
```

or:

```text
You both work with React, Node.js and MongoDB.
```

Do not use random or hardcoded explanations.

The explanation should be generated from the actual matching technologies.

---

# 14. Project Recommendation

The same technology-interest profile can be used to recommend projects.

Example current user:

```text
React       = 90
Node.js     = 80
MongoDB     = 70
Python      = 20
```

Project:

```text
AI Resume Analyzer

React
Node.js
MongoDB
```

The project should receive a high match score.

---

# 15. Project Recommendation Flow

```text
Current User
     ↓
Calculate Technology Interest Profile
     ↓
Get Available Projects
     ↓
Get Technologies for Each Project
     ↓
Compare Project Technologies
     ↓
Calculate Project Match Score
     ↓
Identify Matching Technologies
     ↓
Exclude User's Own Projects if appropriate
     ↓
Remove Duplicates
     ↓
Sort by Score
     ↓
Return Recommended Projects
```

---

# 16. Project Recommendation Response

Conceptually:

```json
{
  "projectId": 12,
  "projectName": "AI Resume Analyzer",
  "matchScore": 91,
  "matchingTechnologies": [
    "React",
    "Node.js",
    "MongoDB"
  ],
  "reason": "Recommended because you frequently interact with React and Node.js projects."
}
```

Use existing DTO conventions.

---

# 17. API Endpoints

The recommendation feature should expose two main capabilities.

## Developer Recommendations

Conceptually:

```http
GET /api/recommendations/developers
```

However, first inspect the existing route naming convention.

If the existing project uses:

```text
/api/User/...
```

then follow that convention.

Do not introduce an unrelated routing style.

---

## Project Recommendations

Conceptually:

```http
GET /api/recommendations/projects
```

Again, adapt to the existing project's route conventions.

---

# 18. Architecture

The recommendation engine follows the existing MVC + Repository + Entity Framework architecture.

```text
┌───────────────────────────────┐
│          Frontend             │
│       Dev-Connector UI        │
└───────────────┬───────────────┘
                │
                │ HTTP Request
                ▼
┌───────────────────────────────┐
│       Recommendation          │
│          Controller           │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Recommendation          │
│           Service             │
│                               │
│  - Build Interest Profile     │
│  - Calculate Similarity       │
│  - Generate Recommendations    │
│  - Generate Explanation       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Existing              │
│        Repositories            │
│                               │
│ User Repository                │
│ Project Repository             │
│ Technology Repository          │
│ Reaction Repository            │
│ Comment Repository             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      Entity Framework Core     │
│          DbContext             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          Database              │
│                               │
│ Users                          │
│ Projects                       │
│ Technologies                   │
│ ProjectTechnologies             │
│ Reactions/Likes                │
│ Comments                       │
└───────────────────────────────┘
```

---

# 19. Recommended Backend Structure

The exact names must follow the existing project.

Conceptually:

```text
Controllers/
    RecommendationController.cs

Services/
    RecommendationService.cs

Repositories/
    Existing repositories reused

DTOs/
    DeveloperRecommendationDto.cs
    ProjectRecommendationDto.cs

Models/
    Existing entities reused

Data/
    Existing DbContext reused
```

Do not create unnecessary repository/entity classes if equivalent functionality already exists.

---

# 20. Data Relationship

The recommendation engine conceptually follows this relationship:

```text
User
 │
 ├───────────────► Own Projects
 │                      │
 │                      ▼
 │                Technologies
 │
 ├───────────────► Likes/Reactions
 │                      │
 │                      ▼
 │                   Projects
 │                      │
 │                      ▼
 │                Technologies
 │
 └───────────────► Comments
                        │
                        ▼
                     Projects
                        │
                        ▼
                   Technologies
```

This allows the system to infer interests from actual behavior.

---

# 21. Important Existing Entities to Reuse

Before implementation, inspect the current backend and identify equivalent entities for:

```text
User
Project
Technology / Skill
ProjectTechnology
Like / Reaction
Comment
DbContext
```

If these already exist, reuse them.

Do NOT create duplicates such as:

```text
RecommendationUser
RecommendationProject
RecommendationTechnology
RecommendationLike
```

unless the existing architecture genuinely requires them.

---

# 22. Edge Cases

## New User

If the user has no activity:

```text
Return an empty recommendation list
```

or use available explicitly declared technologies.

Do not throw an exception.

## No Technologies

Return an empty list or an appropriate fallback.

## No Likes or Comments

Use profile skills and own projects.

## No Matching Developers

Return:

```json
[]
```

not an error.

## No Matching Projects

Return:

```json
[]
```

not an error.

## Current User

Never recommend the current user to themselves.

## Duplicate Results

Never return the same developer/project multiple times.

## Deleted Data

Respect the existing project's deletion/status rules.

---

# 23. Performance Considerations

The first version should remain simple but avoid obvious N+1 query problems.

Prefer:

- Existing Entity Framework relationships.
- Eager loading where appropriate.
- Projections where useful.
- Reusing repository methods.
- Limited database queries.

Do not introduce Redis or another caching system just for this feature.

Do not prematurely optimize.

---

# 24. Implementation Strategy

Use the following implementation order:

```text
1. Inspect existing entities and relationships.
2. Identify existing project/technology/reaction/comment data.
3. Identify existing repositories/services.
4. Create recommendation DTOs if needed.
5. Create RecommendationService.
6. Implement technology interest calculation.
7. Implement developer similarity.
8. Implement project similarity.
9. Create recommendation controller/endpoints.
10. Test edge cases.
11. Build the complete application.
12. Verify existing APIs.
```

---

# 25. Example Complete Flow

Suppose Rahul has:

```text
Skills:
React
Node.js
MongoDB
```

He has created:

```text
Project A:
React + Node.js
```

He liked:

```text
Project B:
React + MongoDB

Project C:
Node.js + Express

Project D:
React + Node.js
```

He commented on:

```text
Project E:
React + MongoDB
```

The system calculates approximately:

```text
React
+10 skill
+15 Project A
+5 Project B
+5 Project D
+8 Project E
----------------
React = 43

Node.js
+10 skill
+15 Project A
+5 Project C
+5 Project D
----------------
Node.js = 35

MongoDB
+10 skill
+5 Project B
+8 Project E
----------------
MongoDB = 23
```

The exact final score depends on whether recency/capping is enabled.

The resulting interest profile is approximately:

```text
React       → 43
Node.js     → 35
MongoDB     → 23
```

Another developer with:

```text
React       → 70
Node.js     → 65
MongoDB     → 40
```

will have significant technology overlap and can receive a high developer match score.

---

# 26. Recommendation Engine Pseudocode

## Build Interest Profile

```text
function BuildInterestProfile(userId):

    profile = empty dictionary

    technologies = GetUserTechnologies(userId)

    for technology in technologies:
        profile[technology] += 10

    projects = GetUserProjects(userId)

    for project in projects:
        for technology in project.technologies:
            profile[technology] += 15

    likedProjects = GetLikedProjects(userId)

    for project in likedProjects:
        for technology in project.technologies:
            profile[technology] += 5

    comments = GetUserComments(userId)

    for comment in comments:
        project = comment.project

        for technology in project.technologies:
            profile[technology] += 8

    for technology in profile:
        profile[technology] = min(profile[technology], 100)

    return profile
```

---

# 27. Developer Matching Pseudocode

```text
function CalculateDeveloperMatch(userA, userB):

    profileA = BuildInterestProfile(userA)
    profileB = BuildInterestProfile(userB)

    commonTechnologies = intersection(
        profileA.keys,
        profileB.keys
    )

    if commonTechnologies is empty:
        return 0

    commonScore = 0

    for technology in commonTechnologies:
        commonScore += min(
            profileA[technology],
            profileB[technology]
        )

    totalScore =
        sum(profileA.values)
        +
        sum(profileB.values)

    if totalScore == 0:
        return 0

    matchScore =
        (2 * commonScore / totalScore) * 100

    return min(matchScore, 100)
```

This is only the conceptual algorithm. The implementation should adapt it to the existing C# project structure and data model.

---

# 28. Project Matching Pseudocode

```text
function CalculateProjectMatch(userId, project):

    userProfile = BuildInterestProfile(userId)

    matchingTechnologies = []

    score = 0

    for technology in project.technologies:

        if technology exists in userProfile:

            score += userProfile[technology]

            matchingTechnologies.add(technology)

    if matchingTechnologies is empty:
        return 0

    maxPossibleScore =
        matchingTechnologies.count * 100

    matchScore =
        (score / maxPossibleScore) * 100

    return min(matchScore, 100)
```

The exact normalization may be adjusted to produce intuitive project-match percentages.

---

# 29. Testing Scenarios

The following cases should be tested.

### Test 1 — Same Technologies

```text
User A:
React, Node.js

User B:
React, Node.js
```

Expected:

```text
High similarity
```

### Test 2 — Completely Different Technologies

```text
User A:
React, Node.js

User B:
Java, Spring
```

Expected:

```text
Low or zero similarity
```

### Test 3 — One Common Technology

```text
User A:
React, Node.js, MongoDB

User B:
React, Java, Spring
```

Expected:

```text
Partial similarity
```

### Test 4 — Repeated Interest

A user interacts with multiple React projects.

Expected:

```text
React receives a stronger interest score.
```

### Test 5 — New User

User has no activity.

Expected:

```text
No error.
```

### Test 6 — Self Recommendation

Expected:

```text
Current user is excluded.
```

### Test 7 — Duplicate Developers

Expected:

```text
Each developer appears only once.
```

### Test 8 — Existing APIs

Expected:

```text
Existing APIs continue working normally.
```

---

# 30. Frontend Usage

The backend should provide enough information for the frontend to display cards such as:

```text
┌───────────────────────────────┐
│ Rahul Patel                   │
│                               │
│ React • Node.js • MongoDB     │
│                               │
│ Match: 87%                    │
│                               │
│ You both work with React and  │
│ Node.js                       │
│                               │
│        [ Connect ]             │
└───────────────────────────────┘
```

Project recommendation:

```text
┌───────────────────────────────┐
│ AI Resume Analyzer             │
│                               │
│ React • Node.js • MongoDB     │
│                               │
│ Match: 91%                    │
│                               │
│ Recommended because you       │
│ frequently interact with      │
│ React projects.               │
│                               │
│        [ View Project ]        │
└───────────────────────────────┘
```

---

# 31. Why This Algorithm Fits Dev-Connector

The algorithm is suitable because developers interact with projects through technologies.

For example:

```text
Developer
   ↓
Creates React Project
   ↓
Likes React Project
   ↓
Comments on React Project
   ↓
Interacts with multiple React Projects
   ↓
System increases React Interest
   ↓
System finds other developers interested in React
   ↓
System recommends those developers
```

Therefore recommendations are based on **actual platform behavior**, not only static profile information.

---

# 32. Future Improvements

The current version should remain simple.

Possible future versions could add:

- Follow relationships
- Connection history
- Project categories
- Search history
- Technology popularity
- Collaborative filtering
- Content similarity
- Embeddings
- ML-based recommendation models
- Personalized recommendation ranking
- Feedback from ignored/rejected recommendations

These are future enhancements and should NOT be implemented in the initial version unless specifically required.

---

# 33. Final Architecture Summary

```text
                    DEV-CONNECTOR
                          │
                          ▼
                 User Activity Data
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
     Skills           Own Projects      Interactions
        │                 │             ┌────┴────┐
        │                 │             │         │
        │                 │           Likes    Comments
        │                 │             │         │
        └─────────────────┴─────────────┴─────────┘
                          │
                          ▼
              Technology Extraction
                          │
                          ▼
               Interest Score Engine
                          │
                          ▼
               User Interest Profile
                          │
                 ┌────────┴─────────┐
                 │                  │
                 ▼                  ▼
        Developer Matching    Project Matching
                 │                  │
                 ▼                  ▼
        Match Score 0–100     Match Score 0–100
                 │                  │
                 └────────┬─────────┘
                          ▼
                 Recommendation API
                          │
                          ▼
                    Frontend UI
```

---

# 34. Core Principle

The entire Developer Recommendation Engine can be summarized as:

```text
More meaningful interaction with a technology
                    ↓
             Higher interest
                    ↓
       Greater technology similarity
                    ↓
        Higher recommendation score
```

The implementation should remain **simple, explainable, modular, and compatible with the existing Dev-Connector backend**.
