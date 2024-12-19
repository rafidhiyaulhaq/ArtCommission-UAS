const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    console.log('Verifying token:', token.substring(0, 20) + '...'); // Log partial token for debugging

    const decodedToken = await auth.verifyIdToken(token);
    console.log('Token verified for user:', decodedToken.uid);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ 
      message: 'Invalid token', 
      error: error.message 
    });
  }
};

module.exports = { verifyToken };