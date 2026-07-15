const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Protect all comment routes
router.use(protect);

// Route for adding a comment to a task
// POST /api/comments
router.route('/')
  .post(addComment);

// Route for getting comments for a specific task
// GET /api/comments/:taskId
router.route('/:taskId')
  .get(getComments);

module.exports = router;