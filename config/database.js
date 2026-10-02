const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khela_kya';

/**
 * Connect to MongoDB with retry logic and graceful error handling.
 */
async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[DB] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected.');
  });

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB:', err.message);
    console.error('[DB] Make sure MongoDB is running and MONGODB_URI is correct in .env');
    process.exit(1);
  }
}

/**
 * Close the MongoDB connection gracefully.
 */
async function disconnectDB() {
  await mongoose.connection.close();
  console.log('[DB] MongoDB connection closed.');
}

module.exports = { connectDB, disconnectDB };
