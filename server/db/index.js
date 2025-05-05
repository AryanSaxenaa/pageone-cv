import mongoose from 'mongoose';

// MongoDB Connection Function
export const connectDB = async (uri) => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000, // Socket timeout
      family: 4 // Force IPv4
    };

    await mongoose.connect(uri, options);
    
    // Set up connection error handlers
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected...');
      
      // Log database details
      const dbStatus = {
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        models: Object.keys(mongoose.models)
      };
      console.log('Database status:', dbStatus);
    });

    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err; // Propagate error to server startup
  }
};

// MongoDB Indexing Strategy
export const setupIndexes = async () => {
  try {
    // Get all collections
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      const indexes = await collection.indexes();
      console.log(`Indexes for ${key}:`, indexes);
    }
    
    return true;
  } catch (err) {
    console.error('Error setting up indexes:', err);
    return false;
  }
};

// MongoDB Aggregation Examples
export const getResumeAnalytics = async (userId) => {
  try {
    const Resume = mongoose.model('Resume');
    
    // Example: Count resumes by education institution
    const educationStats = await Resume.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $unwind: '$education' },
      { $group: {
          _id: '$education.institution',
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    
    // Example: Count resumes by skill
    const skillStats = await Resume.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $project: { 
          languageArray: { $split: ['$skills.languages', ', '] }
      }},
      { $unwind: '$languageArray' },
      { $group: {
          _id: '$languageArray',
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    
    return {
      educationStats,
      skillStats
    };
  } catch (err) {
    console.error('Error running analytics:', err);
    return null;
  }
};

// MongoDB Sharding Configuration (Simulation)
export const shardingInfo = {
  enabled: false,
  config: {
    shardServers: [
      { host: 'shard1.example.com', port: 27017 },
      { host: 'shard2.example.com', port: 27017 },
      { host: 'shard3.example.com', port: 27017 }
    ],
    configServers: [
      { host: 'config1.example.com', port: 27019 },
      { host: 'config2.example.com', port: 27019 },
      { host: 'config3.example.com', port: 27019 }
    ],
    router: { host: 'mongos.example.com', port: 27017 },
    shardKey: { user: 1 },
    collections: ['resumes']
  }
};

// MongoDB Replica Set Configuration (Simulation)
export const replicaSetInfo = {
  enabled: false,
  config: {
    name: 'rs0',
    members: [
      { host: 'primary.example.com:27017', priority: 10, votes: 1 },
      { host: 'secondary1.example.com:27017', priority: 1, votes: 1 },
      { host: 'secondary2.example.com:27017', priority: 1, votes: 1 },
      { host: 'arbiter.example.com:27017', priority: 0, votes: 1, arbiterOnly: true }
    ],
    settings: {
      heartbeatTimeoutSecs: 10,
      electionTimeoutMillis: 10000,
      catchUpTimeoutMillis: 60000
    }
  }
};

export default {
  connectDB,
  setupIndexes,
  getResumeAnalytics,
  shardingInfo,
  replicaSetInfo
};