const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { createMultipleNotifications } = require('../services/notificationService');


// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res, next) => {
  try {
    const { title, description, category, status, techStack, startDate, dueDate, members } = req.body;

    const project = await Project.create({
      title,
      description,
      category: category || 'Web Development',
      status: status || 'In Progress',
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : ['React', 'Node.js']),
      startDate: startDate || new Date(),
      dueDate: dueDate || null,
      createdBy: req.user._id,
      members: members || [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar title role');

    // Notify assigned members
    if (members && members.length > 0) {
      const notifications = members.map((memberId) => ({
        recipient: memberId,
        sender: req.user._id,
        type: 'ASSIGNMENT',
        message: `You have been added to project "${project.title}".`,
        project: project,
      }));
      await createMultipleNotifications(notifications);
    }

    res.status(201).json({ success: true, data: populatedProject });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (filtered by role)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { search, status, category } = req.query;
    let query = {};

    // Developers only see assigned projects unless admin
    if (req.user.role !== 'admin') {
      query.members = req.user._id;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar title role')
      .sort({ createdAt: -1 });

    // Attach task statistics to each project
    const projectsWithStats = await Promise.all(
      projects.map(async (p) => {
        const totalTasks = await Task.countDocuments({ project: p._id });
        const completedTasks = await Task.countDocuments({ project: p._id, status: 'COMPLETED' });
        const inProgressTasks = await Task.countDocuments({ project: p._id, status: 'IN_PROGRESS' });
        const reviewTasks = await Task.countDocuments({ project: p._id, status: 'REVIEW' });
        const todoTasks = await Task.countDocuments({ project: p._id, status: 'TODO' });

        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...p.toObject(),
          taskStats: {
            total: totalTasks,
            completed: completedTasks,
            inProgress: inProgressTasks,
            review: reviewTasks,
            todo: todoTasks,
            progressPercent,
          },
        };
      })
    );

    res.json({ success: true, data: projectsWithStats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar title role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar title')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        tasks,
        taskStats: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
          review: tasks.filter(t => t.status === 'REVIEW').length,
          todo: tasks.filter(t => t.status === 'TODO').length,
          progressPercent,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, category, status, techStack, dueDate, members } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;
    if (techStack) {
      project.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim());
    }
    if (members) project.members = members;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar title role');

    res.json({ success: true, data: updatedProject });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project and associated tasks removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign developers to project
// @route   PUT /api/projects/:id/assign
// @access  Private (Admin)
const assignDevelopers = async (req, res, next) => {
  try {
    const { members } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.members = members;
    await project.save();

    // Create notifications for newly assigned members
    if (members && members.length > 0) {
      const notifications = members.map((memberId) => ({
        recipient: memberId,
        sender: req.user._id,
        type: 'ASSIGNMENT',
        message: `You have been assigned to project "${project.title}".`,
        project: project,
      }));
      await createMultipleNotifications(notifications);
    }

    const updatedProject = await Project.findById(project._id)
      .populate('members', 'name email avatar title role');

    res.json({ success: true, data: updatedProject });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignDevelopers,
};
