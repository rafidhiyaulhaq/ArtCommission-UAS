const express = require('express');
const { verifyToken } = require('../utils/auth');
const commissionController = require('../controllers/commission.controller');

const router = express.Router();

console.log('Fungsi controller:', {
  create: typeof commissionController.createCommission,
  get: typeof commissionController.getCommissionDetails,
  update: typeof commissionController.updateCommissionStatus,
  getAll: typeof commissionController.getUserCommissions
});

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

// src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commissionRoutes = require('./routes/commission.routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();