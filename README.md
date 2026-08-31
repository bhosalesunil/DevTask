# DevTask — Full Stack Project Management Platform

DevTask is a modern, high-performance web platform designed to help software development teams efficiently organize projects, assign tasks, manage Kanban workflows, track team productivity, and collaborate seamlessly.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Create & delete projects, assign team members/developers, manage tasks across projects, view global workspace metrics.
  - **Developer**: Access assigned projects & tasks, update Kanban status, upload deliverables/attachments, collaborate via task comments.
- **Kanban Board Workflow**:
  - Structured columns: `TODO` → `IN_PROGRESS` → `REVIEW` → `COMPLETED`.
  - Drag-and-drop & single-click status transitions.
- **Search & Filters**:
  - Debounced title/description search.
  - Filter by project, workflow status, priority (`Low`, `Medium`, `High`, `Urgent`), developer, and sort by deadline or priority.
- **Interactive Analytics Dashboard**:
  - Key Performance Indicator (KPI) metric cards.
  - Task progress breakdown chart & developer workload manager chart.
  - Recent activity feed and 7-day upcoming deadline alerts.
- **In-App Notifications Center**:
  - Live popover alerts with unread badge count for task assignments, deadline warnings, status updates, and comments.
- **File Uploads**:
  - Upload project documentation, task screenshots, profile images, and comment deliverables via Express Multer / Cloudinary integration.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), React Router v6, Lucide React Icons, Axios, CSS System (Light/Dark themes).
- **Backend**: Node.js, Express.js, RESTful APIs, JWT Authentication, bcryptjs password hashing, Multer file upload, Cloudinary integration.
- **Database**: MongoDB (Mongoose) with MongoMemoryServer fallback for out-of-the-box zero-config execution.

---

## 📂 Project Directory Structure

```
devtask/
├── client/
│   ├── src/
│   │   ├── components/       # KanbanBoard, TaskCard, TaskModal, ProjectModal, StatCard, Charts, NotificationDropdown
│   │   ├── pages/            # Dashboard, Projects, ProjectDetail, Tasks, Developers, Profile, Login, Register
│   │   ├── layouts/          # MainLayout (Sidebar + Navbar), AuthLayout
│   │   ├── services/         # API Service Modules (authService, projectService, taskService, commentService, notificationService)
│   │   ├── context/          # AuthContext, NotificationContext, ThemeContext
│   │   ├── hooks/            # useAuth, useNotification
│   │   ├── utils/            # constants, formatters
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── controllers/          # authController, projectController, taskController, commentController, notificationController, userController
│   ├── models/               # User, Project, Task, Comment, Notification
│   ├── routes/               # authRoutes, projectRoutes, taskRoutes, commentRoutes, notificationRoutes, userRoutes
│   ├── middleware/           # authMiddleware, rbacMiddleware, uploadMiddleware, errorMiddleware
│   ├── services/             # cloudinaryService
│   ├── utils/                # generateToken, seedData
│   ├── config/               # db.js
│   ├── server.js
│   └── package.json
├── .env
├── .gitignore
├── package.json              # Root package orchestrator
└── README.md
```

---

## 🔑 Pre-seeded Demo Credentials

Run `npm run seed` or launch the application to automatically seed initial demo accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@devtask.com` | `password123` | Full workspace admin |
| **Developer 1** | `rahul@devtask.com` | `password123` | Developer view & assigned tasks |
| **Developer 2** | `sarah@devtask.com` | `password123` | Developer view & assigned tasks |

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies
Run the following root command to install both server and client packages:
```bash
npm run install-all
```

### 2. Launch Full Stack Application
Run frontend & backend concurrently:
```bash
npm run dev
```
- **Client Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📡 REST API Reference

### Auth & User APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Fetch profile
- `PUT /api/auth/profile` - Update profile details

### Project APIs
- `GET /api/projects` - List projects (search/filter support)
- `GET /api/projects/:id` - Fetch single project details & task breakdown
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `PUT /api/projects/:id/assign` - Assign team members (Admin)

### Task APIs
- `GET /api/tasks` - List tasks with search, priority, status, developer filters & sorting
- `GET /api/tasks/:id` - Fetch task detail, attachments, and comments
- `POST /api/tasks` - Create task with file attachments
- `PUT /api/tasks/:id` - Update task details & attachments
- `PATCH /api/tasks/:id/status` - Update Kanban status workflow (`TODO`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`)
- `DELETE /api/tasks/:id` - Delete task

### Comments & Notifications
- `GET /api/comments/task/:taskId` - Fetch task comments
- `POST /api/comments/task/:taskId` - Post comment with optional attachment
- `GET /api/notifications` - Fetch user in-app notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
