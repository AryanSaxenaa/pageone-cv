module.exports = async (req, res) => {
  try {
    res.status(200).json({ 
      message: 'Test endpoint working',
      method: req.method,
      query: req.query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Test endpoint error',
      error: error.message 
    });
  }
};
