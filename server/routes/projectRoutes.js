const express = require('express');
const router = express.Router();
const { createProject, getProjects, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Protect all project routes
router.use(protect);

// Route for handling creating and reading projects
// POST /api/projects
// GET /api/projects
router.route('/')
  .post(createProject)
  .get(getProjects);

// Route for handling project deletion by ID
// DELETE /api/projects/:id
router.route('/:id')
  .delete(deleteProject);

module.exports = router;