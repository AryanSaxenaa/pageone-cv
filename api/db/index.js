const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumebuilder';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    };

    await mongoose.connect(mongoUri, options);
    console.log('MongoDB connected successfully');

    // Drop the old username index if it exists
    try {
      const User = require('../models/User');
      await User.collection.dropIndex('username_1');
      console.log('Dropped old username index');
    } catch (indexError) {
      // Index might not exist, which is fine
      console.log('Username index does not exist or already dropped');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;