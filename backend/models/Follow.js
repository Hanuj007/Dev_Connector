const mongoose = require('mongoose');

// Follow Schema representing follow relationships between developers
const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    // Explicitly set collection name to 'Follows'
    collection: 'Follows'
  }
);

// Prevent duplicate follow relationships
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema, 'Follows');
