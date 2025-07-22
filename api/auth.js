import express from 'express';
import { connectDB } from '../db/index.js';
import authRoutes from '../routes/auth.js';

const app = express();
app.use(express.json());

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
  
  // Route auth requests
  app.use('/', authRoutes);
  
  return app(req, res);
}
