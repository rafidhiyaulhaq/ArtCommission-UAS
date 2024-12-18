const { db } = require('../config/firebase');
const { validateCommissionData, calculateFees } = require('../utils/commission');

// Status transition map
const VALID_STATUS_TRANSITIONS = {
  pending: ['active', 'cancelled'],
  active: ['revision', 'completed', 'cancelled'],
  revision: ['active', 'completed', 'cancelled'],
  completed: [],
  cancelled: []
};

// Create new commission
const createCommission = async (req, res) => {
  try {
    const { title, description, price, deadline, requirements } = req.body;
    const clientId = req.user.uid;

    // Validate commission data
    const validationError = validateCommissionData({ title, description, price, deadline });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Calculate fees
    const { artistFee, platformFee } = calculateFees(price);

    const commissionRef = db.collection('commissions').doc();
    await commissionRef.set({
      title,
      description,
      price,
      requirements,
      clientId,
      status: 'pending',
      progress: 0,
      artistFee,
      platformFee,
      timeline: {
        created: new Date().toISOString(),
        deadline,
        lastUpdate: new Date().toISOString()
      },
      milestones: [
        { name: 'Initial Sketch', progress: 25 },
        { name: 'Line Art', progress: 50 },
        { name: 'Coloring', progress: 75 },
        { name: 'Final Touches', progress: 100 }
      ],
      files: [],
      revisionCount: 0,
      maxRevisions: 2,
      updates: [{
        timestamp: new Date().toISOString(),
        status: 'pending',
        message: 'Commission created'
      }]
    });

    res.status(201).json({
      id: commissionRef.id,
      message: 'Commission created successfully'
    });
  } catch (error) {
    console.error('Error creating commission:', error);
    res.status(500).json({ message: 'Error creating commission', error: error.message });
  }
};

// Update commission status
const updateCommissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, progress } = req.body;
    const userId = req.user.uid;

    const commissionRef = db.collection('commissions').doc(id);
    const commission = await commissionRef.get();

    if (!commission.exists) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    const commissionData = commission.data();

    // Check if user has permission
    if (userId !== commissionData.clientId && userId !== commissionData.artistId) {
      return res.status(403).json({ message: 'Unauthorized to update this commission' });
    }

    // Validate status transition
    if (!VALID_STATUS_TRANSITIONS[commissionData.status].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${commissionData.status} to ${status}`
      });
    }

    const timestamp = new Date().toISOString();
    const update = {
      status,
      'timeline.lastUpdate': timestamp,
      progress: progress || commissionData.progress,
      updates: [...commissionData.updates, {
        timestamp,
        status,
        message,
        progress
      }]
    };

    // Special handling for completion
    if (status === 'completed') {
      update.completedAt = timestamp;
    }

    await commissionRef.update(update);

    res.json({ 
      message: 'Commission status updated successfully',
      status,
      timestamp
    });
  } catch (error) {
    console.error('Error updating commission status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Get commission details
const getCommissionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const commissionDoc = await db.collection('commissions').doc(id).get();

    if (!commissionDoc.exists) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    const commissionData = commissionDoc.data();

    // Check if user has permission
    if (userId !== commissionData.clientId && userId !== commissionData.artistId) {
      return res.status(403).json({ message: 'Unauthorized to view this commission' });
    }

    res.json({
      id: commissionDoc.id,
      ...commissionData
    });
  } catch (error) {
    console.error('Error fetching commission:', error);
    res.status(500).json({ message: 'Error fetching commission', error: error.message });
  }
};

// Get user's commissions
const getUserCommissions = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { status, role } = req.query;

    let query = db.collection('commissions');

    // Filter by user role (client or artist)
    if (role === 'client') {
      query = query.where('clientId', '==', userId);
    } else if (role === 'artist') {
      query = query.where('artistId', '==', userId);
    } else {
      // If no role specified, get both
      const [clientCommissions, artistCommissions] = await Promise.all([
        query.where('clientId', '==', userId).get(),
        query.where('artistId', '==', userId).get()
      ]);

      const allCommissions = [
        ...clientCommissions.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...artistCommissions.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];

      return res.json(allCommissions);
    }

    // Additional status filter if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const commissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(commissions);
  } catch (error) {
    console.error('Error fetching user commissions:', error);
    res.status(500).json({ message: 'Error fetching commissions', error: error.message });
  }
};

module.exports = {
  createCommission,
  updateCommissionStatus,
  getCommissionDetails,
  getUserCommissions
};