const Notification = require('../models/Notification');

// Notification Repository handles all database queries for User Notifications
const notificationRepository = {
  // Create a new notification
  createNotification: async (notificationData) => {
    const notification = new Notification(notificationData);
    const saved = await notification.save();
    return await saved.populate('sender', 'name username profileImage');
  },

  // Get all notifications for a specific user, newest first
  getNotifications: async (userId) => {
    return await Notification.find({ user: userId })
      .populate('sender', 'name username profileImage')
      .sort({ createdAt: -1 });
  },

  // Find a notification by its ID
  findById: async (id) => {
    return await Notification.findById(id);
  },

  // Mark a single notification as read
  markAsRead: async (id) => {
    return await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
  },

  // Mark all notifications for a user as read
  markAllAsRead: async (userId) => {
    return await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );
  },

  // Delete a notification by its ID
  deleteNotification: async (id) => {
    return await Notification.findByIdAndDelete(id);
  },

  // Delete all notifications where user is receiver or sender
  deleteByUser: async (userId) => {
    return await Notification.deleteMany({
      $or: [{ user: userId }, { sender: userId }]
    });
  }
};

module.exports = notificationRepository;
