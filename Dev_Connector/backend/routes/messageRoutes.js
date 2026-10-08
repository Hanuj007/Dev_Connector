const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// All message routes require authentication
router.use(authMiddleware);

router.post('/', messageController.sendMessage);
router.get('/permission/:userId', messageController.checkPermission);
router.get('/:userId', messageController.getConversation);
router.put('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
