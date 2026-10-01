const mongoose = require('mongoose');

// Message Schema for direct chats between developers
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Message text cannot be empty'],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    // Explicitly set collection name to 'Messages'
    collection: 'Messages'
  }
);

module.exports = mongoose.model('Message', messageSchema, 'Messages');
