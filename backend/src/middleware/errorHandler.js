const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
  
    if (err.code && err.code.startsWith('auth/')) {
      return res.status(401).json({
        status: 'error',
        code: err.code,
        message: 'Error autentikasi',
        details: err.message
      });
    }
  
    if (err.code && err.code.startsWith('firestore/')) {
      return res.status(500).json({
        status: 'error',
        code: err.code,
        message: 'Error database',
        details: err.message
      });
    }
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validasi gagal',
        details: err.details || err.message
      });
    }
  
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    });
  };
  
  module.exports = errorHandler;