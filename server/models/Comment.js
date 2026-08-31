const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please add comment text'],
    },
    attachment: {
      name: String,
      url: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
