const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all task routes
router.use(protect);

// Route for handling task creation and retrieval (by project query parameter)
// POST /api/tasks
// GET /api/tasks
router.route('/')
  .post(createTask)
  .get(getTasks);

// Route for handling status updating and task deletion by ID
// PUT /api/tasks/:id
// DELETE /api/tasks/:id
router.route('/:id')
  .put(updateTaskStatus)
  .delete(deleteTask);

module.exports = router;