module.exports = async (req, res) => {
  try {
    console.log('Environment test endpoint called');
    
    // Check environment variables
    const envCheck = {
      MONGODB_URI_exists: !!process.env.MONGODB_URI,
      JWT_SECRET_exists: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      timestamp: new Date().toISOString()
    };
    
    console.log('Environment check:', envCheck);
    
    // Also log the first few chars of the variables (for debugging without exposing them)
    if (process.env.MONGODB_URI) {
      console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 20) + '...');
    }
    if (process.env.JWT_SECRET) {
      console.log('JWT_SECRET starts with:', process.env.JWT_SECRET.substring(0, 10) + '...');
    }
    
    res.status(200).json({
      message: 'Environment test successful',
      environment: envCheck
    });
  } catch (error) {
    console.error('Environment test error:', error);
    res.status(500).json({
      message: 'Environment test failed',
      error: error.message
    });
  }
};
