const mongoose = require('mongoose');

// GithubRepository Schema for cached GitHub repositories of developers
const githubRepositorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    repoId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    htmlUrl: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: ''
    },
    stars: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    // Explicitly set collection name to 'githubRepositories'
    collection: 'githubRepositories'
  }
);

// Compound index to ensure a user doesn't duplicate the same repoId entry
githubRepositorySchema.index({ user: 1, repoId: 1 }, { unique: true });

module.exports = mongoose.model('GithubRepository', githubRepositorySchema, 'githubRepositories');
