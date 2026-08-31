const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017';

    // Attempt standard connection with 3 sec timeout
    const conn = await mongoose.connect(connStr, {
      dbName: 'devtask',
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Primary connection to local MongoDB failed (${error.message}). Starting In-Memory MongoDB Server...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[In-Memory MongoDB Connected]: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`[MongoDB Error]: Failed to connect to MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
