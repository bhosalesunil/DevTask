const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all developers / team members
// @route   GET /api/users/developers
// @access  Private
const getDevelopers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/users/dashboard-stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    // Filter if developer
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map((p) => p._id);
      
      projectFilter = { members: req.user._id };
      taskFilter = {
        $or: [{ assignedTo: req.user._id }, { project: { $in: projectIds } }],
      };
    }

    const totalProjects = await Project.countDocuments(projectFilter);
    const totalTasks = await Task.countDocuments(taskFilter);
    const todoTasks = await Task.countDocuments({ ...taskFilter, status: 'TODO' });
    const inProgressTasks = await Task.countDocuments({ ...taskFilter, status: 'IN_PROGRESS' });
    const reviewTasks = await Task.countDocuments({ ...taskFilter, status: 'REVIEW' });
    const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'COMPLETED' });

    // Check overdue tasks (due before today and not completed)
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'COMPLETED' },
      dueDate: { $lt: new Date() },
    });

    // Recent tasks
    const recentTasks = await Task.find(taskFilter)
      .populate('project', 'title')
      .populate('assignedTo', 'name avatar')
      .sort({ updatedAt: -1 })
      .limit(6);

    // Upcoming deadlines (within next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const upcomingDeadlines = await Task.find({
      ...taskFilter,
      status: { $ne: 'COMPLETED' },
      dueDate: { $gte: new Date(), $lte: sevenDaysFromNow },
    })
      .populate('project', 'title')
      .populate('assignedTo', 'name avatar')
      .sort({ dueDate: 1 })
      .limit(5);

    // Workload breakdown by developer
    const developers = await User.find({ role: 'developer' }).select('name avatar title');
    const developerWorkload = await Promise.all(
      developers.map(async (dev) => {
        const devTasksCount = await Task.countDocuments({ assignedTo: dev._id });
        const devCompletedCount = await Task.countDocuments({ assignedTo: dev._id, status: 'COMPLETED' });
        return {
          developer: {
            _id: dev._id,
            name: dev.name,
            avatar: dev.avatar,
            title: dev.title,
          },
          totalTasks: devTasksCount,
          completedTasks: devCompletedCount,
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        reviewTasks,
        completedTasks,
        overdueTasks,
        statusBreakdown: {
          TODO: todoTasks,
          IN_PROGRESS: inProgressTasks,
          REVIEW: reviewTasks,
          COMPLETED: completedTasks,
        },
        recentTasks,
        upcomingDeadlines,
        developerWorkload,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevelopers,
  getUserStats,
};
