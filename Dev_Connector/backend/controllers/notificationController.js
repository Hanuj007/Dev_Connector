const mongoose = require('mongoose');
const notificationRepository = require('../repositories/notificationRepository');

// Notification Controller handles fetching, marking read, and deleting notifications
const notificationController = {
  // GET /api/notifications - Get logged-in user's notifications (Protected)
  getNotifications: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const notifications = await notificationRepository.getNotifications(userId);

      return res.status(200).json({
        count: notifications.length,
        notifications
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/notifications/:id/read - Mark single notification as read (Protected)
  markAsRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Notification not found (invalid ID format)' });
      }

      const notification = await notificationRepository.findById(id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      // Check ownership
      if (String(notification.user) !== String(userId)) {
        return res.status(403).json({ message: 'Not authorized to modify this notification' });
      }

      const updated = await notificationRepository.markAsRead(id);

      return res.status(200).json({
        message: 'Notification marked as read',
        notification: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/notifications/read-all - Mark all notifications as read (Protected)
  markAllAsRead: async (req, res, next) => {
    try {
      const userId = req.user._id;
      await notificationRepository.markAllAsRead(userId);

      return res.status(200).json({
        message: 'All notifications marked as read'
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/notifications/:id - Delete a notification (Protected)
  deleteNotification: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Notification not found (invalid ID format)' });
      }

      const notification = await notificationRepository.findById(id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      // Check ownership
      if (String(notification.user) !== String(userId)) {
        return res.status(403).json({ message: 'Not authorized to delete this notification' });
      }

      await notificationRepository.deleteNotification(id);

      return res.status(200).json({
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;
