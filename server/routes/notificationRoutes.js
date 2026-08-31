const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  clearNotifications,
  sendTestEmail,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getNotifications);
router.post('/test-email', sendTestEmail);
router.patch('/read-all', clearNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;

