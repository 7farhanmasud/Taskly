const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Add a comment to a task
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { taskId, text } = req.body;

    if (!taskId || !text) {
      return res.status(400).json({ message: 'Please provide task ID and comment text' });
    }

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: taskId,
      user: req.user._id,
      text
    });

    // Populate user info before returning
    const populatedComment = await Comment.findById(comment._id).populate('user', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a specific task
// @route   GET /api/comments/:taskId
// @access  Private
const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task: taskId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments
};