const express = require('express');
const { verifyToken } = require('../utils/auth');
const {
  createCommission,
  getCommissionDetails,
  updateCommissionStatus,
  getUserCommissions
} = require('../controllers/commission.controller');

const router = express.Router();

// Protected routes - semua perlu autentikasi
router.use(verifyToken);

// Create new commission
router.post('/', createCommission);

// Get all user's commissions (harus berada sebelum route dengan parameter)
router.get('/user/all', getUserCommissions);

// Get specific commission detail (setelah route spesifik)
router.get('/:id', getCommissionDetails);

// Update commission status and progress
router.put('/:id/status', updateCommissionStatus);

module.exports = router;