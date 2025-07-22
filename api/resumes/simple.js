module.exports = async (req, res) => {
  try {
    // Test basic endpoint without any imports
    const { id } = req.query;
    
    res.json({ 
      message: 'Resume endpoint test',
      method: req.method,
      id: id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Test error',
      error: error.message 
    });
  }
};
