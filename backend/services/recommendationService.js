const recommendationRepository = require('../repositories/recommendationRepository');
const RECOMMENDATION_CONFIG = require('../config/recommendationConfig');
const {
  normalizeTechnology,
  extractTechnologiesFromText
} = require('../utils/technologyExtractor');

const { WEIGHTS, RECENCY, THRESHOLDS } = RECOMMENDATION_CONFIG;

/**
 * Helper to check if a date occurred within the recency window
 */
function isRecent(date, windowDays = RECENCY.WINDOW_DAYS) {
  if (!date) return false;
  const ageMs = Date.now() - new Date(date).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays <= windowDays;
}

/**
 * Helper to format an array of technology strings into a natural English list
 * e.g. ["React", "Node.js", "MongoDB"] -> "React, Node.js, and MongoDB"
 */
function formatTechList(technologies) {
  if (!technologies || technologies.length === 0) return '';
  if (technologies.length === 1) return technologies[0];
  if (technologies.length === 2) return `${technologies[0]} and ${technologies[1]}`;
  return `${technologies.slice(0, -1).join(', ')}, and ${technologies[technologies.length - 1]}`;
}

const recommendationService = {
  /**
   * Build the technology-interest profile dynamically from multiple database signals.
   * Centralized weights:
   *  - Explicit skills in user profile: +10
   *  - User's own project technologies: +15 (with recency boost)
   *  - Technologies discussed in created posts: +10 (with recency boost)
   *  - Liked post/project technologies: +5 (with recency boost)
   *  - Repeated interactions accumulate additively
   * 
   * @param {string|ObjectId} userId
   * @returns {Promise<Object>} Map of { [technology]: score } sorted descending
   */
  calculateUserInterestProfile: async (userId) => {
    const profile = {};

    // Helper to safely add to score with optional multiplier
    const addScore = (techName, weight, isRecentActivity = false) => {
      if (!techName) return;
      const normalized = normalizeTechnology(techName);
      if (!normalized) return;

      const finalWeight = isRecentActivity
        ? Math.round(weight * RECENCY.BOOST_MULTIPLIER)
        : weight;

      profile[normalized] = (profile[normalized] || 0) + finalWeight;
    };

    // 1. Fetch user to get explicit skills
    const user = await recommendationRepository.getUserById(userId);
    if (!user) return {};

    if (Array.isArray(user.skills)) {
      for (const skill of user.skills) {
        addScore(skill, WEIGHTS.USER_EXPLICIT_SKILL);
      }
    }

    // 2. Fetch technologies used in user's own projects (GitHub repositories)
    const userRepos = await recommendationRepository.getUserRepositories(userId);
    for (const repo of userRepos) {
      const recent = isRecent(repo.updatedAt || repo.createdAt);

      // Primary language
      if (repo.language) {
        addScore(repo.language, WEIGHTS.USER_PROJECT_TECH, recent);
      }

      // Technologies in repo name
      const nameTechs = extractTechnologiesFromText(repo.name);
      for (const tech of nameTechs) {
        addScore(tech, WEIGHTS.USER_PROJECT_TECH, recent);
      }

      // Technologies in repo description
      if (repo.description) {
        const descTechs = extractTechnologiesFromText(repo.description);
        for (const tech of descTechs) {
          addScore(tech, WEIGHTS.USER_PROJECT_TECH, recent);
        }
      }
    }

    // 3. Technologies mentioned in posts authored by the user
    const userPosts = await recommendationRepository.getUserCreatedPosts(userId);
    for (const post of userPosts) {
      const recent = isRecent(post.createdAt);
      const postTechs = extractTechnologiesFromText(post.text);
      for (const tech of postTechs) {
        addScore(tech, WEIGHTS.POST_CREATED_TECH, recent);
      }
    }

    // 4. Technologies in posts liked by the user (likes/reactions)
    const likedPosts = await recommendationRepository.getUserLikedPosts(userId);
    for (const post of likedPosts) {
      const recent = isRecent(post.createdAt);
      const postTechs = extractTechnologiesFromText(post.text);

      // Repeated likes on posts with the same technology increase the score additively
      for (const tech of postTechs) {
        addScore(tech, WEIGHTS.LIKED_PROJECT_TECH, recent);
      }

      // If the post author has skills, provide mild affinity
      if (post.user && Array.isArray(post.user.skills)) {
        for (const authorSkill of post.user.skills) {
          addScore(authorSkill, 2, recent);
        }
      }
    }

    return profile;
  },

  /**
   * Recommend developers who have similar technology interests.
   * Uses weighted Jaccard similarity across dynamic technology interest profiles.
   * 
   * @param {string|ObjectId} currentUserId
   * @param {Object} options { limit, minScore }
   * @returns {Promise<Array>} Ranked developer recommendations
   */
  getRecommendedDevelopers: async (currentUserId, options = {}) => {
    const limit = Math.min(
      parseInt(options.limit, 10) || THRESHOLDS.DEFAULT_LIMIT,
      THRESHOLDS.MAX_LIMIT
    );
    const minScore = parseInt(options.minScore, 10) || THRESHOLDS.MIN_MATCH_SCORE;

    // Build technology-interest profile for the current user
    const currentUserProfile = await recommendationService.calculateUserInterestProfile(currentUserId);
    const currentUserTechKeys = Object.keys(currentUserProfile);

    // If the current user has zero skills and zero activity, return an empty list gracefully
    if (currentUserTechKeys.length === 0) {
      return [];
    }

    // Fetch all other candidates (excluding current user to prevent self-recommendation)
    const candidateUsers = await recommendationRepository.getAllCandidateUsers(currentUserId);
    if (!candidateUsers || candidateUsers.length === 0) {
      return [];
    }

    const recommendations = [];

    for (const candidate of candidateUsers) {
      // Build candidate's technology-interest profile
      const candidateProfile = await recommendationService.calculateUserInterestProfile(candidate._id);
      const candidateTechKeys = Object.keys(candidateProfile);

      // Identify overlapping technologies
      const overlappingTechs = currentUserTechKeys.filter(
        (tech) => candidateProfile[tech] && candidateProfile[tech] > 0
      );

      // If no overlapping technologies, skip
      if (overlappingTechs.length === 0) {
        continue;
      }

      // Calculate Weighted Jaccard Similarity (0 - 100%)
      // sharedStrength = sum(min(scoreA, scoreB)) across shared technologies
      // totalStrength  = sum(max(scoreA, scoreB)) across all union technologies
      let sharedStrength = 0;
      let totalStrength = 0;

      const allUniqueTechs = new Set([...currentUserTechKeys, ...candidateTechKeys]);

      for (const tech of allUniqueTechs) {
        const scoreA = currentUserProfile[tech] || 0;
        const scoreB = candidateProfile[tech] || 0;

        if (scoreA > 0 && scoreB > 0) {
          sharedStrength += Math.min(scoreA, scoreB);
        }
        totalStrength += Math.max(scoreA, scoreB);
      }

      const matchScore = totalStrength > 0
        ? Math.min(100, Math.round((sharedStrength / totalStrength) * 100))
        : 0;

      // Filter by minimum required match score
      if (matchScore < minScore) {
        continue;
      }

      // Sort matching technologies by mutual strength descending
      overlappingTechs.sort((a, b) => {
        const minA = Math.min(currentUserProfile[a], candidateProfile[a]);
        const minB = Math.min(currentUserProfile[b], candidateProfile[b]);
        return minB - minA;
      });

      // Generate explainable reason based on top matching technologies
      const topTechs = overlappingTechs.slice(0, 3);
      const techListStr = formatTechList(topTechs);

      let reason = `You both have interest in ${techListStr}.`;
      if (matchScore >= 75) {
        reason = `You both have strong interests in ${techListStr}.`;
      } else if (matchScore >= 40) {
        reason = `High compatibility with shared skills in ${techListStr}.`;
      }

      recommendations.push({
        userId: candidate._id,
        name: candidate.name,
        username: candidate.username,
        bio: candidate.bio || '',
        profileImage: candidate.profileImage || '',
        skills: candidate.skills || [],
        matchScore,
        matchingTechnologies: overlappingTechs,
        reason
      });
    }

    // Sort primarily by matchScore descending, secondarily by number of matching technologies
    recommendations.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.matchingTechnologies.length - a.matchingTechnologies.length;
    });

    return recommendations.slice(0, limit);
  },

  /**
   * Recommend projects/repositories that the current developer may be interested in.
   * Matches projects against the user's technology-interest profile.
   * 
   * @param {string|ObjectId} currentUserId
   * @param {Object} options { limit, minScore }
   * @returns {Promise<Array>} Ranked project recommendations
   */
  getRecommendedProjects: async (currentUserId, options = {}) => {
    const limit = Math.min(
      parseInt(options.limit, 10) || THRESHOLDS.DEFAULT_LIMIT,
      THRESHOLDS.MAX_LIMIT
    );
    const minScore = parseInt(options.minScore, 10) || THRESHOLDS.MIN_MATCH_SCORE;

    // Build current user's technology profile
    const userProfile = await recommendationService.calculateUserInterestProfile(currentUserId);
    const userTechKeys = Object.keys(userProfile);

    // If user has no activity/skills, return empty list gracefully
    if (userTechKeys.length === 0) {
      return [];
    }

    // Find highest individual score to normalize user interest relative to their own strongest skills
    const maxUserScore = Math.max(1, ...Object.values(userProfile));

    // Fetch all candidate projects/repositories (excluding projects owned by current user)
    const candidateProjects = await recommendationRepository.getAllCandidateProjects(currentUserId);
    if (!candidateProjects || candidateProjects.length === 0) {
      return [];
    }

    const recommendations = [];

    for (const project of candidateProjects) {
      const projectTechsSet = new Set();

      // Project primary language
      if (project.language) {
        const normLang = normalizeTechnology(project.language);
        if (normLang) projectTechsSet.add(normLang);
      }

      // Technologies found in project name
      const nameTechs = extractTechnologiesFromText(project.name);
      nameTechs.forEach((t) => projectTechsSet.add(t));

      // Technologies found in project description
      if (project.description) {
        const descTechs = extractTechnologiesFromText(project.description);
        descTechs.forEach((t) => projectTechsSet.add(t));
      }

      // Technologies associated with author's declared skills
      if (project.user && Array.isArray(project.user.skills)) {
        project.user.skills.forEach((s) => {
          const normSkill = normalizeTechnology(s);
          if (normSkill) projectTechsSet.add(normSkill);
        });
      }

      const projectTechs = Array.from(projectTechsSet);
      if (projectTechs.length === 0) {
        continue;
      }

      // Overlapping technologies between user profile and project
      const matchingTechs = projectTechs.filter(
        (tech) => userProfile[tech] && userProfile[tech] > 0
      );

      if (matchingTechs.length === 0) {
        continue;
      }

      // Calculate Match Score (0 - 100%):
      // 1. Average Interest Strength: How much the user likes the matching technologies
      const totalStrength = matchingTechs.reduce(
        (sum, tech) => sum + Math.min(1.0, userProfile[tech] / maxUserScore),
        0
      );
      const avgStrength = totalStrength / matchingTechs.length;

      // 2. Coverage Ratio: What fraction of the project's stack the user matches
      const coverageRatio = matchingTechs.length / projectTechs.length;

      // Weighted score combination: 65% interest strength + 35% project coverage
      const rawScore = (0.65 * avgStrength + 0.35 * coverageRatio) * 100;
      const matchScore = Math.min(100, Math.max(1, Math.round(rawScore)));

      if (matchScore < minScore) {
        continue;
      }

      // Sort matching technologies by user's interest score descending
      matchingTechs.sort((a, b) => (userProfile[b] || 0) - (userProfile[a] || 0));

      const topTechs = matchingTechs.slice(0, 3);
      const techListStr = formatTechList(topTechs);
      const reason = `Recommended because you frequently interact with ${techListStr} projects.`;

      recommendations.push({
        projectId: project._id,
        projectName: project.name,
        description: project.description || '',
        language: project.language || '',
        htmlUrl: project.htmlUrl,
        stars: project.stars || 0,
        forks: project.forks || 0,
        author: {
          _id: project.user?._id,
          name: project.user?.name || '',
          username: project.user?.username || ''
        },
        matchScore,
        matchingTechnologies: matchingTechs,
        reason
      });
    }

    // Sort by matchScore descending, then by repository stars as tie-breaker
    recommendations.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.stars - a.stars;
    });

    return recommendations.slice(0, limit);
  }
};

module.exports = recommendationService;
