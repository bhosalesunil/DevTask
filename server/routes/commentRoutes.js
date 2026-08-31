const express = require('express');
const router = express.Router();
const {
  getTaskComments,
  addComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/task/:taskId')
  .get(getTaskComments)
  .post(upload.single('attachment'), addComment);

router.delete('/:id', deleteComment);

module.exports = router;
