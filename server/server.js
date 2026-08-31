const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.PORT) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const seedData = require('./utils/seedData');
const User = require('./models/User');

// Connect to Database
connectDB().then(async () => {
  // Auto-seed if database is empty
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Automatically populating initial seed data...');
      await seedData();
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err.message);
  }
});

const app = express();

// Body parsers & CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root test endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DevTask REST API Server is running smoothly' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  DevTask Backend Server running on port ${PORT}`);
  console.log(`  API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
});
