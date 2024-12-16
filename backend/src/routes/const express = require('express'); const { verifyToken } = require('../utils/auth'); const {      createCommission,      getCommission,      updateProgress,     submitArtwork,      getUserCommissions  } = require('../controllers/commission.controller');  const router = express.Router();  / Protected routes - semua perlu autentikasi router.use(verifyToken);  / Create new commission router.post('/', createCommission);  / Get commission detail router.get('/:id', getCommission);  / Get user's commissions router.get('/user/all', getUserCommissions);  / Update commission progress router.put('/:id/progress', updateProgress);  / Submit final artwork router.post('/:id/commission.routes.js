const express = require('express');
const { verifyToken } = require('../utils/auth');
const { 
    createCommission, 
    getCommission, 
    updateProgress,
    submitArtwork, 
    getUserCommissions 
} = require('../controllers/commission.controller');

const router = express.Router();

// Protected routes - semua perlu autentikasi
router.use(verifyToken);

// Create new commission
router.post('/', createCommission);

// Get commission detail
router.get('/:id', getCommission);

// Get user's commissions
router.get('/user/all', getUserCommissions);

// Update commission progress
router.put('/:id/progress', updateProgress);

// Submit final artwork
router.post('/:id/submit', submitArtwork);

module.exports = router;