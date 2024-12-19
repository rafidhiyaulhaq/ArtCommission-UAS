const express = require('express');
const { verifyToken } = require('../utils/auth');
const {
  createCommission,
  getCommissionDetails,
  updateCommissionStatus,
  getUserCommissions
} = require('../controllers/commission.controller');

const router = express.Router();

// Gunakan verifyToken sebagai middleware untuk semua routes
router.use(verifyToken);

// Create new commission
router.post('/', createCommission);

// Get user's commissions
router.get('/user/all', getUserCommissions);

// Get commission detail
router.get('/:id', getCommissionDetails);

// Update commission status
router.put('/:id/status', updateCommissionStatus);

module.exports = router;