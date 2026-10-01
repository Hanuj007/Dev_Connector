const Message = require('../models/Message');

// Message Repository handles all database queries for direct chat messages
const messageRepository = {
  // Create and save a new chat message
  createMessage: async (messageData) => {
    const message = new Message(messageData);
    const savedMessage = await message.save();
    return await savedMessage.populate('sender receiver', 'name username profileImage');
  },

  // Get conversation between two users sorted chronologically
  getConversation: async (user1, user2) => {
    return await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    })
      .populate('sender', 'name username profileImage')
      .populate('receiver', 'name username profileImage')
      .sort({ createdAt: 1 });
  },

  // Find a message by its ID
  findById: async (id) => {
    return await Message.findById(id);
  },

  // Mark a specific message as read
  markAsRead: async (id) => {
    return await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
  },

  // Delete a message by its ID
  deleteMessage: async (id) => {
    return await Message.findByIdAndDelete(id);
  },

  // Delete all messages sent or received by a user (used on account deletion)
  deleteByUser: async (userId) => {
    return await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    });
  }
};

module.exports = messageRepository;
