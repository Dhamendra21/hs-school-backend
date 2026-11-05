const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('MongoDB connected to MONGODB_URI');
      return;
    } catch (err) {
      console.log('Could not connect to process.env.MONGODB_URI, falling back to local or in-memory MongoDB...');
    }
  }

  // Try standard local MongoDB with short timeout
  try {
    const localUri = 'mongodb://127.0.0.1:27017/phs_school';
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected to local instance (127.0.0.1:27017)');
    return;
  } catch (err) {
    console.log('Local MongoDB server not available. Starting in-memory MongoDB database...');
  }

  // Fallback to in-memory MongoDB
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected using MongoMemoryServer at:', mongoUri);
  } catch (err) {
    console.error('Failed to start in-memory MongoDB server:', err);
    throw err;
  }
}

module.exports = connectDB;
