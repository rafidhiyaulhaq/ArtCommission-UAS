const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commissionRoutes = require('./routes/commission.routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Production-ready CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://rafidhiyaulhaq.github.io/ArtCommission-UAS',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
};

app.use(cors(corsOptions));
app.use(express.json());

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
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan di port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});