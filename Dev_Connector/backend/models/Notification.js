const mongoose = require('mongoose');

// Notification Schema for user alerts (follow, like, comment, message)
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['follow', 'like', 'comment', 'message'],
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    // Explicitly set collection name to 'Notifications'
    collection: 'Notifications'
  }
);

module.exports = mongoose.model('Notification', notificationSchema, 'Notifications');
