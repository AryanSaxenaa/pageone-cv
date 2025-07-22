import { connectDB } from './db/index.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'connected',
    message: 'Server is running'
  });
});

// Initialize database connection
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB(process.env.MONGODB_URI);
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }
  
  return app(req, res);
}