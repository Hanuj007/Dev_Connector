const mongoose = require('mongoose');

// Post Schema for developer updates and discussions
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true,
    // Explicitly set collection name to 'Posts'
    collection: 'Posts'
  }
);

module.exports = mongoose.model('Post', postSchema, 'Posts');
