const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers);
    console.log('Auth header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }
    
    console.log('Token yang diverifikasi:', token.substring(0, 20) + '...');
    
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Token terdekode:', decodedToken);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error auth:', error);
    next(error);
  }
};

module.exports = { verifyToken };
