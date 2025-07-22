module.exports = async (req, res) => {
  res.status(200).json({ 
    message: 'Basic test working',
    timestamp: new Date().toISOString()
  });
};
