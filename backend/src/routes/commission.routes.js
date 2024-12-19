const express = require('express');
const { verifyToken } = require('../utils/auth');
const {
  createCommission,
  getCommissionDetails,
  updateCommissionStatus,
  getUserCommissions
} = require('../controllers/commission.controller');

const router = express.Router();

// Aplikasikan verifyToken ke setiap route secara individual
router.post('/', verifyToken, createCommission);
router.get('/user/all', verifyToken, getUserCommissions);
router.get('/:id', verifyToken, getCommissionDetails);
router.put('/:id/status', verifyToken, updateCommissionStatus);

module.exports = router;