const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Comment.deleteMany();
    await Notification.deleteMany();

    console.log('Seeding demo users...');
    const admin = await User.create({
      name: 'Alex Morgan',
      email: 'admin@devtask.com',
      password: 'password123',
      role: 'admin',
      title: 'Engineering Manager & Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const dev1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@devtask.com',
      password: 'password123',
      role: 'developer',
      title: 'Senior Frontend Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const dev2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@devtask.com',
      password: 'password123',
      role: 'developer',
      title: 'Full Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    console.log('Seeding demo projects...');
    const project1 = await Project.create({
      title: 'E-Commerce Website',
      description: 'Full stack online retail platform with cart, checkout, payment gateway, and customer dashboard.',
      category: 'Web Development',
      status: 'In Progress',
      techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Stripe'],
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
      members: [dev1._id, dev2._id],
    });

    const project2 = await Project.create({
      title: 'Mobile Banking App',
      description: 'Cross-platform mobile application for banking transactions, account overview, and fund transfers.',
      category: 'Mobile App',
      status: 'In Progress',
      techStack: ['React Native', 'Express', 'JWT', 'Firebase'],
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
      members: [dev1._id],
    });

    console.log('Seeding demo tasks...');
    const task1 = await Task.create({
      title: 'Create Login UI',
      description: 'Build sleek login & registration page with form validation and JWT token persistence.',
      project: project1._id,
      assignedTo: dev1._id,
      priority: 'High',
      status: 'COMPLETED',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    });

    const task2 = await Task.create({
      title: 'Create Product API',
      description: 'Implement RESTful API endpoints for product CRUD, filtering by category, and text search.',
      project: project1._id,
      assignedTo: dev2._id,
      priority: 'High',
      status: 'COMPLETED',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    });

    const task3 = await Task.create({
      title: 'Implement Cart',
      description: 'Develop client-side cart state management with persistent storage and item quantity controls.',
      project: project1._id,
      assignedTo: dev1._id,
      priority: 'Medium',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    });

    const task4 = await Task.create({
      title: 'Payment Integration',
      description: 'Integrate Stripe payment checkout API, webhook processing, and order confirmation email sending.',
      project: project1._id,
      assignedTo: dev2._id,
      priority: 'Urgent',
      status: 'TODO',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    });

    const task5 = await Task.create({
      title: 'Mobile Responsiveness & Testing',
      description: 'Test layout across tablet and mobile viewports. Fix drawer component overflow issues.',
      project: project1._id,
      assignedTo: dev1._id,
      priority: 'Medium',
      status: 'REVIEW',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    });

    const task6 = await Task.create({
      title: 'Biometric Authentication API',
      description: 'Setup Touch ID & Face ID authentication handler for native mobile client.',
      project: project2._id,
      assignedTo: dev1._id,
      priority: 'High',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    });

    console.log('Seeding comments...');
    await Comment.create({
      task: task3._id,
      user: dev1._id,
      content: 'I have created the local cart context store. Working on syncing state with local storage now.',
    });

    await Comment.create({
      task: task3._id,
      user: admin._id,
      content: 'Great progress Rahul! Make sure to add stock quantity check before adding item to cart.',
    });

    console.log('Seeding notifications...');
    await Notification.create({
      recipient: dev1._id,
      sender: admin._id,
      type: 'ASSIGNMENT',
      message: 'You have been assigned a new task: "Implement Cart"',
      task: task3._id,
      project: project1._id,
    });

    await Notification.create({
      recipient: dev2._id,
      sender: admin._id,
      type: 'DEADLINE',
      message: 'Task "Payment Integration" deadline is approaching.',
      task: task4._id,
      project: project1._id,
    });

    await Notification.create({
      recipient: dev1._id,
      sender: admin._id,
      type: 'COMMENT',
      message: 'Alex Morgan commented on your task "Implement Cart".',
      task: task3._id,
      project: project1._id,
    });

    console.log('Seed completed successfully!');
    console.log('\n--- DEMO USER CREDENTIALS ---');
    console.log('ADMIN:     admin@devtask.com / password123');
    console.log('DEV 1:     rahul@devtask.com / password123');
    console.log('DEV 2:     sarah@devtask.com / password123');

    if (process.argv[2] === '--exit') {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
