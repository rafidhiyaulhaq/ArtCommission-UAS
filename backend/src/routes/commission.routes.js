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
router.use((req, res, next) => {
  verifyToken(req, res, next);
});

// Routes
router.post('/', createCommission);
router.get('/user/all', getUserCommissions);
router.get('/:id', getCommissionDetails);
router.put('/:id/status', updateCommissionStatus);

module.exports = router;