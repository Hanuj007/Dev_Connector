const mongoose = require('mongoose');
const messageRepository = require('../repositories/messageRepository');
const userRepository = require('../repositories/userRepository');
const notificationService = require('../services/notificationService');

// Message Controller handles 1-on-1 direct messages between developers
const messageController = {
  // POST /api/messages - Send a message to another developer (Protected)
  sendMessage: async (req, res, next) => {
    try {
      const senderId = req.user._id;
      const { receiver, text } = req.body;

      if (!receiver) {
        return res.status(400).json({ message: 'Receiver user ID is required' });
      }

      if (!mongoose.Types.ObjectId.isValid(receiver)) {
        return res.status(404).json({ message: 'Invalid receiver ID format' });
      }

      if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Message text cannot be empty' });
      }

      // Prevent messaging oneself
      if (String(senderId) === String(receiver)) {
        return res.status(400).json({ message: 'You cannot send a message to yourself' });
      }

      // Check if receiver exists
      const receiverUser = await userRepository.findById(receiver);
      if (!receiverUser) {
        return res.status(404).json({ message: 'Receiver not found' });
      }

      // Create and save message
      const newMessage = await messageRepository.createMessage({
        sender: senderId,
        receiver,
        text: text.trim()
      });

      // Send notification to receiver
      await notificationService.notifyMessage(req.user, receiver);

      return res.status(201).json({
        message: 'Message sent successfully',
        data: newMessage
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/messages/:userId - Get conversation between logged-in user and another user (Protected)
  getConversation: async (req, res, next) => {
    try {
      const currentUserId = req.user._id;
      const otherUserId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
        return res.status(404).json({ message: 'Invalid user ID format' });
      }

      const otherUser = await userRepository.findById(otherUserId);
      if (!otherUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const messages = await messageRepository.getConversation(currentUserId, otherUserId);

      return res.status(200).json({
        count: messages.length,
        messages
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/messages/:id/read - Mark message as read (Receiver only)
  markAsRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Message not found (invalid ID format)' });
      }

      const message = await messageRepository.findById(id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      // Only receiver can mark message as read
      if (String(message.receiver) !== String(currentUserId)) {
        return res.status(403).json({ message: 'Only the receiver can mark this message as read' });
      }

      const updated = await messageRepository.markAsRead(id);

      return res.status(200).json({
        message: 'Message marked as read',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/messages/:id - Delete message (Sender or Receiver only)
  deleteMessage: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Message not found (invalid ID format)' });
      }

      const message = await messageRepository.findById(id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      // Only sender or receiver can delete
      const isSender = String(message.sender) === String(currentUserId);
      const isReceiver = String(message.receiver) === String(currentUserId);

      if (!isSender && !isReceiver) {
        return res.status(403).json({ message: 'Not authorized to delete this message' });
      }

      await messageRepository.deleteMessage(id);

      return res.status(200).json({
        message: 'Message deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = messageController;
