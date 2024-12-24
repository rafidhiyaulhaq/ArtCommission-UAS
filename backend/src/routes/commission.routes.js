const express = require('express');
const { verifyToken } = require('../utils/auth');
const commissionController = require('../controllers/commission.controller');

const router = express.Router();

// Public routes
router.get('/public', commissionController.getPublicCommissions);

// Protected routes
router.post('/', 
  verifyToken,
  commissionController.createCommission
);

router.get('/user/all',
  verifyToken,
  commissionController.getUserCommissions
);

router.get('/:id',
  verifyToken,
  commissionController.getCommissionDetails
);

router.put('/:id/status',
  verifyToken,
  commissionController.updateCommissionStatus
);

module.exports = router;