const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commissionRoutes = require('./routes/commission.routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Production-ready CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'https://rafidhiyaulhaq.github.io',
    // Add other domains that need API access
    'http://localhost:3000', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ArtCommission API',
    version: '1.0.0',
    documentation: {
      description: 'ArtCommission API endpoints',
      endpoints: {
        health: '/health',
        commissions: '/api/commissions',
        publicCommissions: '/api/commissions/public'
      }
    }
  });
});

// API routes
app.use('/api/commissions', commissionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server berjalan dengan baik',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Let Railway assign the port
const port = process.env.PORT || 8080;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan di ${process.env.RAILWAY_STATIC_URL || `http://localhost:${port}`}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});