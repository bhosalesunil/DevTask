const nodemailer = require('nodemailer');

/**
 * Helper to create transporter based on environment variables
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null; // Return null if SMTP credentials aren't configured yet
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Base Email Wrapper Layout
 */
const wrapEmailTemplate = (contentHeader, contentBody, actionUrl = null, actionText = null) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevTask Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f9;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      padding: 25px 30px;
      text-align: left;
    }
    .header-logo {
      display: inline-block;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #38bdf8;
    }
    .header-subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .content {
      padding: 30px;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .badge-assignment { background-color: #e0f2fe; color: #0369a1; }
    .badge-status { background-color: #fef3c7; color: #b45309; }
    .badge-comment { background-color: #f3e8ff; color: #6b21a8; }
    .badge-project { background-color: #dcfce7; color: #15803d; }
    .info-card {
      background-color: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 15px 20px;
      border-radius: 0 6px 6px 0;
      margin: 20px 0;
    }
    .info-row {
      margin: 8px 0;
      font-size: 14px;
    }
    .info-label {
      font-weight: 600;
      color: #64748b;
      display: inline-block;
      width: 110px;
    }
    .btn {
      display: inline-block;
      padding: 12px 26px;
      background-color: #0284c7;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 20px;
      box-shadow: 0 2px 5px rgba(2, 132, 199, 0.3);
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">⚡ DevTask</div>
      <div class="header-subtitle">Real-time Task & Project Management System</div>
    </div>
    <div class="content">
      ${contentHeader}
      ${contentBody}
      ${actionUrl && actionText ? `<div style="text-align: center; margin-top: 25px;"><a href="${actionUrl}" class="btn" target="_blank">${actionText}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>This is an automated notification from your DevTask workspace.</p>
      <p>&copy; ${new Date().getFullYear()} DevTask Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Email Templates Generator Functions
 */
const templates = {
  // 1. Task Assignment Template
  taskAssignment: ({ recipientName, senderName, taskTitle, projectTitle, priority, dueDate, taskUrl }) => {
    const header = `
      <span class="badge badge-assignment">Task Assigned</span>
      <h2 style="margin: 0 0 10px 0; color: #0f172a;">Hi ${recipientName || 'Developer'},</h2>
      <p style="margin: 0; color: #475569;">You have been assigned a new task by <strong>${senderName || 'Admin'}</strong>.</p>
    `;
    const body = `
      <div class="info-card">
        <div class="info-row"><span class="info-label">Task:</span> <strong>${taskTitle}</strong></div>
        <div class="info-row"><span class="info-label">Project:</span> ${projectTitle || 'General'}</div>
        <div class="info-row"><span class="info-label">Priority:</span> ${priority || 'Medium'}</div>
        <div class="info-row"><span class="info-label">Due Date:</span> ${dueDate ? new Date(dueDate).toLocaleDateString() : 'No Deadline'}</div>
      </div>
      <p style="color: #475569; font-size: 14px;">Please review the task details and update the status as you make progress.</p>
    `;
    return wrapEmailTemplate(header, body, taskUrl, 'View Task in DevTask');
  },

  // 2. Project Assignment Template
  projectAssignment: ({ recipientName, senderName, projectTitle, description, techStack, projectUrl }) => {
    const header = `
      <span class="badge badge-project">Project Member</span>
      <h2 style="margin: 0 0 10px 0; color: #0f172a;">Hi ${recipientName || 'Team Member'},</h2>
      <p style="margin: 0; color: #475569;">You have been added to project <strong>"${projectTitle}"</strong> by ${senderName || 'Admin'}.</p>
    `;
    const body = `
      <div class="info-card">
        <div class="info-row"><span class="info-label">Project:</span> <strong>${projectTitle}</strong></div>
        ${description ? `<div class="info-row"><span class="info-label">Description:</span> ${description}</div>` : ''}
        ${techStack && techStack.length > 0 ? `<div class="info-row"><span class="info-label">Tech Stack:</span> ${Array.isArray(techStack) ? techStack.join(', ') : techStack}</div>` : ''}
      </div>
      <p style="color: #475569; font-size: 14px;">You can now view project tasks, collaborate with team members, and track milestone progress.</p>
    `;
    return wrapEmailTemplate(header, body, projectUrl, 'Explore Project Workspace');
  },

  // 3. Task Status Change Template
  statusChange: ({ recipientName, senderName, taskTitle, oldStatus, newStatus, taskUrl }) => {
    const formatStatus = (s) => (s ? s.replace('_', ' ') : 'N/A');
    const header = `
      <span class="badge badge-status">Status Update</span>
      <h2 style="margin: 0 0 10px 0; color: #0f172a;">Hi ${recipientName || 'Team Member'},</h2>
      <p style="margin: 0; color: #475569;"><strong>${senderName || 'A teammate'}</strong> updated the status of a task you are associated with.</p>
    `;
    const body = `
      <div class="info-card" style="border-left-color: #f59e0b;">
        <div class="info-row"><span class="info-label">Task:</span> <strong>${taskTitle}</strong></div>
        <div class="info-row"><span class="info-label">Previous:</span> <span style="text-decoration: line-through; color: #94a3b8;">${formatStatus(oldStatus)}</span></div>
        <div class="info-row"><span class="info-label">New Status:</span> <strong style="color: #10b981;">${formatStatus(newStatus)}</strong></div>
      </div>
    `;
    return wrapEmailTemplate(header, body, taskUrl, 'Open Task Details');
  },

  // 4. Task Comment Template
  commentAdded: ({ recipientName, commenterName, taskTitle, commentContent, taskUrl }) => {
    const header = `
      <span class="badge badge-comment">New Comment</span>
      <h2 style="margin: 0 0 10px 0; color: #0f172a;">Hi ${recipientName || 'Team Member'},</h2>
      <p style="margin: 0; color: #475569;"><strong>${commenterName || 'Someone'}</strong> commented on task <strong>"${taskTitle}"</strong>.</p>
    `;
    const body = `
      <div class="info-card" style="border-left-color: #8b5cf6; background-color: #faf5ff;">
        <p style="margin: 0; font-style: italic; color: #4c1d95;">"${commentContent}"</p>
      </div>
    `;
    return wrapEmailTemplate(header, body, taskUrl, 'Reply to Comment');
  },

  // 5. Test Email Template
  testEmail: ({ recipientName, appUrl }) => {
    const header = `
      <span class="badge badge-project">System Test</span>
      <h2 style="margin: 0 0 10px 0; color: #0f172a;">Hello ${recipientName || 'DevTask User'},</h2>
      <p style="margin: 0; color: #475569;">This is a test email sent from your DevTask Email Notification System.</p>
    `;
    const body = `
      <div class="info-card">
        <p style="margin: 0; color: #0369a1;"><strong>Status:</strong> ✅ Nodemailer SMTP email service is operational and correctly configured!</p>
      </div>
    `;
    return wrapEmailTemplate(header, body, appUrl || 'http://localhost:5173', 'Launch DevTask App');
  },
};

/**
 * Send Email Core Function
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const fromName = process.env.FROM_NAME || 'DevTask Notifications';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@devtask.com';

    const transporter = createTransporter();

    // If SMTP credentials are not configured, simulate sending by logging formatted preview
    if (!transporter) {
      console.log(`\n=============================================================`);
      console.log(` 📧 [EMAIL SERVICE DEMO LOG] (SMTP Credentials Not Set)`);
      console.log(` -------------------------------------------------------------`);
      console.log(`  To: ${to}`);
      console.log(`  From: "${fromName}" <${fromEmail}>`);
      console.log(`  Subject: ${subject}`);
      console.log(` -------------------------------------------------------------`);
      console.log(`  (Email HTML content rendered safely in memory)`);
      console.log(`=============================================================\n`);
      return { success: true, simulated: true, message: 'Email logged to console (No SMTP credentials configured)' };
    }

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: text || 'You have a new notification from DevTask.',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [EMAIL SENT] MessageId: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [EMAIL ERROR] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  templates,
};
