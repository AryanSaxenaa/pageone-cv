module.exports = async (req, res) => {
  try {
    console.log('Simple test endpoint called');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    res.status(200).json({
      message: 'Test endpoint working',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      message: 'Test endpoint error',
      error: error.message 
    });
  }
};
