const verifyToken = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers); // Log semua headers
    console.log('Auth header:', req.headers.authorization); // Log header auth spesifik
    
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    console.log('Token to verify:', token.substring(0, 20) + '...'); // Log awal token

    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded token:', decodedToken); // Log token yang sudah di-decode
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error); // Log error lengkap
    res.status(401).json({ 
      message: 'Invalid token',
      error: error.message,
      details: error.stack // Tambah stack trace
    });
  }
};