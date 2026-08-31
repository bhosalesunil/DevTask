const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { createNotification } = require('../services/notificationService');


// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let fileUrl = `/uploads/${file.filename}`;
        const cloudUrl = await uploadToCloudinary(file.path);
        if (cloudUrl) fileUrl = cloudUrl;

        attachments.push({
          name: file.originalname,
          url: fileUrl,
          fileType: file.mimetype,
        });
      }
    }

    const task = await Task.create({
      title,
      description: description || '',
      project,
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      status: status || 'TODO',
      dueDate: dueDate || null,
      attachments,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title category')
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar');

    // Create Notification for assigned developer
    if (assignedTo) {
      await createNotification({
        recipient: assignedTo,
        sender: req.user._id,
        type: 'ASSIGNMENT',
        message: `You have been assigned a new task: "${task.title}"`,
        task: populatedTask,
        project: project,
      });
    }

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks with search, filter, and sort
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignedTo, search, sortBy } = req.query;
    let query = {};

    // Developers only see tasks assigned to them or tasks in projects they belong to
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map((p) => p._id);
      
      query.$or = [
        { assignedTo: req.user._id },
        { project: { $in: projectIds } }
      ];
    }

    if (project) {
      query.project = project;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'deadline') {
      sortOptions = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      // Custom priority order logic in memory or default sort
      sortOptions = { priority: -1 };
    } else if (sortBy === 'title') {
      sortOptions = { title: 1 };
    }

    const tasks = await Task.find(query)
      .populate('project', 'title category')
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar')
      .sort(sortOptions);

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title category members')
      .populate('assignedTo', 'name email avatar title role')
      .populate('createdBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comments = await Comment.find({ task: task._id })
      .populate('user', 'name email avatar title role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        ...task.toObject(),
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, priority, status, assignedTo, dueDate } = req.body;

    const oldAssignedTo = task.assignedTo ? task.assignedTo.toString() : null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let fileUrl = `/uploads/${file.filename}`;
        const cloudUrl = await uploadToCloudinary(file.path);
        if (cloudUrl) fileUrl = cloudUrl;

        task.attachments.push({
          name: file.originalname,
          url: fileUrl,
          fileType: file.mimetype,
        });
      }
    }

    await task.save();

    // If assignedTo changed, notify the new user
    if (assignedTo && assignedTo.toString() !== oldAssignedTo) {
      await createNotification({
        recipient: assignedTo,
        sender: req.user._id,
        type: 'ASSIGNMENT',
        message: `You have been assigned to task "${task.title}".`,
        task: task,
        project: task.project,
      });
    }

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'title category')
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar');

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (Kanban status change)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid task status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    // Notify creator or assigned user if status changed
    if (oldStatus !== status) {
      const recipient = task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()
        ? task.assignedTo
        : (task.createdBy.toString() !== req.user._id.toString() ? task.createdBy : null);

      if (recipient) {
        await createNotification({
          recipient,
          sender: req.user._id,
          type: 'STATUS_CHANGE',
          message: `Task "${task.title}" status changed to ${status.replace('_', ' ')}.`,
          task: task,
          project: task.project,
          emailMeta: {
            oldStatus,
            newStatus: status,
          },
        });
      }
    }

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'title category')
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar');

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Admins can delete any task; developers can only delete tasks they created
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Comment.deleteMany({ task: task._id });
    await Notification.deleteMany({ task: task._id });
    await task.deleteOne();

    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
