const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please add a title and description' });
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // Fetch all projects and populate the creator details
    const projects = await Project.find().populate('createdBy', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Optional: Only the creator can delete a project
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this project' });
    }

    // Find all tasks related to this project
    const tasks = await Task.find({ project: req.params.id });
    const taskIds = tasks.map(task => task._id);

    // Delete all comments associated with the tasks of this project
    await Comment.deleteMany({ task: { $in: taskIds } });

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    // Delete the project itself
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Project and associated tasks/comments removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject
};