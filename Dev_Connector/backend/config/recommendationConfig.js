// Centralized Configuration for the Developer Recommendation Engine
// All weights and scoring parameters are centralized here to avoid hardcoding across services.

const RECOMMENDATION_CONFIG = {
  // Scoring weights for user technology interest calculation (as defined in project specification)
  WEIGHTS: {
    USER_EXPLICIT_SKILL: 10,       // Technology explicitly listed in user profile (skills array)
    USER_PROJECT_TECH: 15,          // Technology used in user's own project/repository
    POST_CREATED_TECH: 10,          // Technology discussed in user's own post
    LIKED_PROJECT_TECH: 5,          // Technology in post/project liked by the user
    COMMENTED_PROJECT_TECH: 8,      // Technology in post/project commented on by the user
    FOLLOWED_DEVELOPER_TECH: 4      // Technology affinity from developers followed by the user
  },

  // Recency settings: recent activity has slightly more influence than older activity
  RECENCY: {
    BOOST_MULTIPLIER: 1.25,        // Multiplier applied to interactions within the recency window
    WINDOW_DAYS: 30                // Activities within the last 30 days are considered "recent"
  },

  // Matching & Recommendation Thresholds
  THRESHOLDS: {
    MIN_MATCH_SCORE: 1,            // Minimum score (out of 100) required to include in recommendations
    DEFAULT_LIMIT: 10,             // Default number of recommendations returned
    MAX_LIMIT: 50                  // Maximum number of recommendations allowed per request
  }
};

module.exports = RECOMMENDATION_CONFIG;
