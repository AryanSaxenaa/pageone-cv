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
    
    if (req.method === 'GET') {
      // Get all resumes for the user
      const resumes = await Resume.find({ user: req.user.id });
      res.json(resumes);
    } else if (req.method === 'POST') {
      // Create new resume
      const { name, personalInfo, education, experience, skills, projects } = req.body;
      
      const resume = new Resume({
        name,
        personalInfo,
        education,
        experience,
        skills,
        projects,
        user: req.user.id
      });
      
      await resume.save();
      res.status(201).json(resume);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Resumes error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
