const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { createNotification } = require('../services/notificationService');


// @desc    Get comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
const getTaskComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name email avatar title role')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    let attachment = null;
    if (req.file) {
      let fileUrl = `/uploads/${req.file.filename}`;
      const cloudUrl = await uploadToCloudinary(req.file.path);
      if (cloudUrl) fileUrl = cloudUrl;

      attachment = {
        name: req.file.originalname,
        url: fileUrl,
      };
    }

    const comment = await Comment.create({
      task: task._id,
      user: req.user._id,
      content,
      attachment,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email avatar title role');

    // Notify task assignee or creator
    const recipients = new Set();
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      recipients.add(task.assignedTo.toString());
    }
    if (task.createdBy && task.createdBy.toString() !== req.user._id.toString()) {
      recipients.add(task.createdBy.toString());
    }

    for (const recipientId of recipients) {
      await createNotification({
        recipient: recipientId,
        sender: req.user._id,
        type: 'COMMENT',
        message: `${req.user.name} commented on task "${task.title}".`,
        task: task,
        project: task.project,
        emailMeta: {
          commentContent: content,
        },
      });
    }

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTaskComments,
  addComment,
  deleteComment,
};
