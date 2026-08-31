const Notification = require('../models/Notification');
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { sendEmail, templates } = require('./emailService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Creates an in-app notification and dispatches an email notification
 * 
 * @param {Object} params
 * @param {string} params.recipient - User ID of notification recipient
 * @param {string} params.sender - User ID of notification sender
 * @param {string} params.type - 'ASSIGNMENT' | 'STATUS_CHANGE' | 'COMMENT' | 'DEADLINE'
 * @param {string} params.message - Text description of notification
 * @param {string} [params.task] - Task ID (optional)
 * @param {string} [params.project] - Project ID (optional)
 * @param {Object} [params.emailMeta] - Additional email metadata (oldStatus, newStatus, commentContent, etc.)
 */
const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  task = null,
  project = null,
  emailMeta = {},
}) => {
  try {
    // 1. Create In-App Notification in MongoDB
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      task: task ? (task._id || task) : null,
      project: project ? (project._id || project) : null,
    });

    // 2. Asynchronously fetch details for Email Dispatch (Non-blocking background execution)
    dispatchNotificationEmail({ recipient, sender, type, message, task, project, emailMeta }).catch((err) => {
      console.error('⚠️ Error dispatching notification email:', err.message);
    });

    return notification;
  } catch (error) {
    console.error('❌ Error creating in-app notification:', error.message);
    throw error;
  }
};

/**
 * Creates notifications for multiple recipients (e.g. Project members assignment)
 */
const createMultipleNotifications = async (notificationsList) => {
  try {
    const createdNotifications = await Notification.insertMany(notificationsList);

    // Dispatch emails asynchronously in background
    for (const item of notificationsList) {
      dispatchNotificationEmail(item).catch((err) => {
        console.error('⚠️ Error dispatching batch notification email:', err.message);
      });
    }

    return createdNotifications;
  } catch (error) {
    console.error('❌ Error creating batch notifications:', error.message);
    throw error;
  }
};

/**
 * Helper to construct and send the email
 */
const dispatchNotificationEmail = async ({ recipient, sender, type, message, task, project, emailMeta = {} }) => {
  // Fetch recipient user object
  const recipientUser = typeof recipient === 'object' && recipient.email
    ? recipient
    : await User.findById(recipient).select('name email');

  if (!recipientUser || !recipientUser.email) {
    return;
  }

  // Fetch sender user object
  let senderUser = null;
  if (sender) {
    senderUser = typeof sender === 'object' && sender.name
      ? sender
      : await User.findById(sender).select('name email');
  }

  // Fetch task if ID passed
  let taskDoc = task;
  if (task && typeof task === 'string') {
    taskDoc = await Task.findById(task).populate('project', 'title');
  }

  // Fetch project if ID passed
  let projectDoc = project;
  if (project && typeof project === 'string') {
    projectDoc = await Project.findById(project);
  }

  const senderName = senderUser ? senderUser.name : 'DevTask Admin';
  const recipientName = recipientUser.name;
  const taskTitle = taskDoc ? taskDoc.title : (emailMeta.taskTitle || 'Task');
  const projectTitle = projectDoc ? projectDoc.title : (taskDoc && taskDoc.project ? taskDoc.project.title : 'DevTask Project');
  
  const taskUrl = taskDoc ? `${FRONTEND_URL}/tasks?taskId=${taskDoc._id}` : `${FRONTEND_URL}/tasks`;
  const projectUrl = projectDoc ? `${FRONTEND_URL}/projects` : `${FRONTEND_URL}/dashboard`;

  let subject = `[DevTask] Notification: ${message}`;
  let html = '';

  switch (type) {
    case 'ASSIGNMENT':
      if (taskDoc) {
        subject = `⚡ DevTask: You've been assigned to task "${taskTitle}"`;
        html = templates.taskAssignment({
          recipientName,
          senderName,
          taskTitle,
          projectTitle,
          priority: taskDoc.priority,
          dueDate: taskDoc.dueDate,
          taskUrl,
        });
      } else if (projectDoc) {
        subject = `📁 DevTask: Added to Project "${projectTitle}"`;
        html = templates.projectAssignment({
          recipientName,
          senderName,
          projectTitle,
          description: projectDoc.description,
          techStack: projectDoc.techStack,
          projectUrl,
        });
      }
      break;

    case 'STATUS_CHANGE':
      subject = `🔄 DevTask: Status updated for task "${taskTitle}"`;
      html = templates.statusChange({
        recipientName,
        senderName,
        taskTitle,
        oldStatus: emailMeta.oldStatus,
        newStatus: emailMeta.newStatus || (taskDoc ? taskDoc.status : ''),
        taskUrl,
      });
      break;

    case 'COMMENT':
      subject = `💬 DevTask: New comment on task "${taskTitle}"`;
      html = templates.commentAdded({
        recipientName,
        commenterName: senderName,
        taskTitle,
        commentContent: emailMeta.commentContent || message,
        taskUrl,
      });
      break;

    default:
      subject = `🔔 DevTask: ${message}`;
      html = templates.testEmail({ recipientName, appUrl: FRONTEND_URL });
      break;
  }

  if (html) {
    await sendEmail({
      to: recipientUser.email,
      subject,
      html,
      text: message,
    });
  }
};

module.exports = {
  createNotification,
  createMultipleNotifications,
  dispatchNotificationEmail,
};
