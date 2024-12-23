const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commissionRoutes = require('./routes/commission.routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Konfigurasi CORS untuk production
app.use(cors({
  origin: [
    'https://rafidhiyaulhaq.github.io/ArtCommission-UAS/', // Sesuaikan dengan domain GitHub Pages Anda
    process.env.FRONTEND_URL // Tambahkan variabel environment untuk URL frontend
  ].filter(Boolean), // Hapus nilai yang undefined/null
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/commissions', commissionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server berjalan dengan baik',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});