const notificationRepository = require('../repositories/notificationRepository');

// Notification Service provides helper functions for generating alerts
const notificationService = {
  // Generic helper to create a notification
  createNotification: async ({ user, sender, type, text }) => {
    // Avoid creating notification if user is acting on their own content
    if (String(user) === String(sender)) {
      return null;
    }

    return await notificationRepository.createNotification({
      user,
      sender,
      type,
      text
    });
  },

  // Notification for a new follower
  notifyFollow: async (followerUser, targetUserId) => {
    return await notificationService.createNotification({
      user: targetUserId,
      sender: followerUser._id,
      type: 'follow',
      text: `${followerUser.name} started following you`
    });
  },

  // Notification for a post like
  notifyLike: async (likerUser, postOwnerId) => {
    return await notificationService.createNotification({
      user: postOwnerId,
      sender: likerUser._id,
      type: 'like',
      text: `${likerUser.name} liked your post`
    });
  },

  // Notification for a new message
  notifyMessage: async (senderUser, receiverId) => {
    return await notificationService.createNotification({
      user: receiverId,
      sender: senderUser._id,
      type: 'message',
      text: `You have a new message from ${senderUser.name}`
    });
  }
};

module.exports = notificationService;
