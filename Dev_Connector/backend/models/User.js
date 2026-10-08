const mongoose = require('mongoose');

// User Schema for developers on Dev_Connector
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password']
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    githubUsername: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    // Explicitly set collection name to 'Users'
    collection: 'Users'
  }
);

module.exports = mongoose.model('User', userSchema, 'Users');
