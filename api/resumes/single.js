const Resume = require('../models/Resume');
const connectDB = require('../db');
const auth = require('../middleware/auth');

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
    await connectDB();
    
    // Run auth middleware
    await runMiddleware(req, res, auth);
    
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }
    
    if (req.method === 'GET') {
      // Get specific resume
      const resume = await Resume.findOne({ _id: id, user: req.user.id });
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      res.json(resume);
    } else if (req.method === 'PUT') {
      // Update resume
      const { name, personalInfo, education, experience, skills, projects } = req.body;
      
      const resume = await Resume.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { name, personalInfo, education, experience, skills, projects },
        { new: true }
      );
      
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } else if (req.method === 'DELETE') {
      // Delete resume
      const resume = await Resume.findOneAndDelete({ _id: id, user: req.user.id });
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      res.json({ message: 'Resume deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Resume operation error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
