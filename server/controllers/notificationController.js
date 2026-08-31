const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name avatar')
      .populate('task', 'title status')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear / Mark all as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const clearNotifications = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Send test notification email
// @route   POST /api/notifications/test-email
// @access  Private
const sendTestEmail = async (req, res, next) => {
  try {
    const targetEmail = req.body.email || req.user.email;
    const { sendEmail, templates } = require('../services/emailService');

    const html = templates.testEmail({ recipientName: req.user.name });
    const result = await sendEmail({
      to: targetEmail,
      subject: '⚡ DevTask: Email Service Verification',
      html,
      text: 'DevTask email service is working properly!',
    });

    res.json({
      success: true,
      message: `Test email dispatched to ${targetEmail}`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications,
  sendTestEmail,
};

