const express = require('express');
const authMiddleware = require('../utils/auth');
const commissionController = require('../controllers/commission.controller');

const router = express.Router();

// Debug log untuk melihat imported functions
console.log('Controller functions:', {
  create: typeof commissionController.createCommission,
  get: typeof commissionController.getCommissionDetails,
  update: typeof commissionController.updateCommissionStatus,
  getAll: typeof commissionController.getUserCommissions
});

// Routes dengan middleware
router.post('/', 
  authMiddleware.verifyToken,
  commissionController.createCommission
);

router.get('/user/all', 
  authMiddleware.verifyToken,
  commissionController.getUserCommissions
);

router.get('/:id', 
  authMiddleware.verifyToken,
  commissionController.getCommissionDetails
);

router.put('/:id/status', 
  authMiddleware.verifyToken,
  commissionController.updateCommissionStatus
);

module.exports = router;