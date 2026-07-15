const Task = require('../models/Task');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedToEmail } = req.body;

    if (!title || !description || !project || !assignedToEmail) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Find user by email to assign the task
    const assignedUser = await User.findOne({ email: assignedToEmail });
    if (!assignedUser) {
      return res.status(404).json({ message: 'Assigned user email not found' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedUser._id,
      status: 'Pending'
    });

    // Populate user info before returning
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=projectId
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({ message: 'Project ID query parameter is required' });
    }

    const tasks = await Task.find({ project }).populate('assignedTo', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    res.status(200).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete all comments associated with this task
    await Comment.deleteMany({ task: req.params.id });

    // Delete the task
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Task and associated comments removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask
};