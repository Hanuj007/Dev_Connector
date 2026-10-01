const recommendationService = require('../services/recommendationService');

// Recommendation Controller handles HTTP requests for developer and project recommendations
const recommendationController = {
  // GET /api/recommendations/developers - Get recommended developers based on technology interest
  getRecommendedDevelopers: async (req, res, next) => {
    try {
      const currentUserId = req.user._id;
      const { limit, minScore } = req.query;

      const developers = await recommendationService.getRecommendedDevelopers(currentUserId, {
        limit,
        minScore
      });

      return res.status(200).json({
        count: developers.length,
        developers
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/recommendations/projects - Get recommended projects based on user activity & tech profile
  getRecommendedProjects: async (req, res, next) => {
    try {
      const currentUserId = req.user._id;
      const { limit, minScore } = req.query;

      const projects = await recommendationService.getRecommendedProjects(currentUserId, {
        limit,
        minScore
      });

      return res.status(200).json({
        count: projects.length,
        projects
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/recommendations/profile - Get current user's computed technology interest profile
  getUserInterestProfile: async (req, res, next) => {
    try {
      const currentUserId = req.user._id;
      const profile = await recommendationService.calculateUserInterestProfile(currentUserId);

      return res.status(200).json({
        userId: currentUserId,
        profile
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = recommendationController;
