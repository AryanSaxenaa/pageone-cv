import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db/index.js';

// Route imports
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB with enhanced error handling
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/resumes', resumeRoutes);

    // MongoDB connection status
    app.get('/api/status', (req, res) => {
      res.json({ 
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbName: mongoose.connection.name || 'none',
        version: mongoose.version
      });
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../dist')));
      
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
      });
    }

    return app;
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  startServer().then(app => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// For Vercel deployment
export default async (req, res) => {
  if (!global.app) {
    global.app = await startServer();
  }
  return global.app(req, res);
};