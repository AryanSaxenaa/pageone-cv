const connectDB = require('../../db');
const auth = require('../../middleware/auth');

// Helper function to handle middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

module.exports = async (req, res) => {
  try {
    console.log('API handler started for:', req.method, req.url);
    
    // Step 1: Test basic response
    if (req.query.test === 'basic') {
      return res.json({ message: 'Basic test passed', timestamp: new Date().toISOString() });
    }
    
    console.log('Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('Environment check - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Step 2: Test database connection
    if (req.query.test === 'db') {
      await connectDB();
      return res.json({ message: 'Database connection test passed', timestamp: new Date().toISOString() });
    }
    
    // Step 3: Test auth middleware
    if (req.query.test === 'auth') {
      await connectDB();
      await runMiddleware(req, res, auth);
      return res.json({ 
        message: 'Auth test passed', 
        userId: req.user?.id,
        timestamp: new Date().toISOString() 
      });
    }
    
    // Step 4: Test model loading
    if (req.query.test === 'model') {
      await connectDB();
      await runMiddleware(req, res, auth);
      
      const Resume = require('../../models/Resume');
      console.log('Resume model loaded successfully');
      
      return res.json({ 
        message: 'Model test passed', 
        userId: req.user?.id,
        timestamp: new Date().toISOString() 
      });
    }
    
    // Regular endpoint logic
    await connectDB();
    console.log('Database connected successfully');
    
    // Run auth middleware
    await runMiddleware(req, res, auth);
    console.log('Auth middleware completed, user ID:', req.user?.id);
    
    const { id } = req.query;
    console.log('Resume ID from query:', id);
    
    // Dynamically load Resume model to avoid potential circular dependency
    const Resume = require('../../models/Resume');
    
    if (req.method === 'GET') {
      console.log('Get resume request');
      const resume = await Resume.findOne({ _id: id, user: req.user.id });
      console.log('Resume found:', !!resume);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      res.json(resume);
    } else if (req.method === 'PUT') {
      console.log('Update resume request');
      const { title, personalInfo, education, experience, skills, projects } = req.body;
      
      const resume = await Resume.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { title, personalInfo, education, experience, skills, projects },
        { new: true }
      );
      
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } else if (req.method === 'DELETE') {
      console.log('Delete resume request');
      const resume = await Resume.findOneAndDelete({ _id: id, user: req.user.id });
      if (!resume) {
        console.log('Resume not found for deletion');
        return res.status(404).json({ message: 'Resume not found' });
      }
      console.log('Resume deleted successfully');
      res.json({ message: 'Resume deleted successfully' });
    } else {
      console.log('Method not allowed:', req.method);
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Resume operation error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // More specific error responses
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message 
      });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid ID format', 
        details: error.message 
      });
    } else if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ 
        message: 'Database error', 
        details: error.message 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Authentication error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      errorType: error.name,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
