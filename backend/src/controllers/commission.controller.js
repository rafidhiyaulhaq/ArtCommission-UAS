const { db } = require('../config/firebase');
const { validateCommissionData, calculateFees } = require('../utils/commission');

const VALID_STATUS_TRANSITIONS = {
  pending: ['active', 'cancelled'],
  active: ['revision', 'completed', 'cancelled'],
  revision: ['active', 'completed', 'cancelled'],
  completed: [],
  cancelled: []
};

const getPublicCommissions = async (req, res) => {
  try {
    const snapshot = await db.collection('commissions')
      .where('status', '==', 'active')
      .limit(20)
      .get();
    
    const commissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Filter out sensitive information
      clientId: undefined,
      artistId: undefined,
      platformFee: undefined
    }));

    res.json({
      status: 'success',
      data: commissions
    });
  } catch (error) {
    console.error('Error fetching public commissions:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching commissions', 
      error: error.message 
    });
  }
};

const createCommission = async (req, res) => {
  try {
    const title = req.body.title || '';
    const description = req.body.description || '';
    const price = Number(req.body.price) || 0;
    const deadline = req.body.deadline || '';
    const requirements = req.body.requirements || '';

    if (!title || !description || !price || !deadline) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: 'Title, description, price, and deadline are required'
      });
    }

    const clientId = req.user?.uid;
    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const commissionData = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      requirements: requirements.trim(),
      clientId,
      status: 'pending',
      progress: 0,
      artistFee: price * 0.7, 
      platformFee: price * 0.3, 
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
    };

    const commissionRef = db.collection('commissions').doc();
    await commissionRef.set(commissionData);

    res.status(201).json({
      status: 'success',
      message: 'Commission created successfully',
      data: {
        id: commissionRef.id,
        ...commissionData
      }
    });

  } catch (error) {
    console.error('Error creating commission:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error creating commission', 
      error: error.message 
    });
  }
};

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

    if (userId !== commissionData.clientId && userId !== commissionData.artistId) {
      return res.status(403).json({ message: 'Unauthorized to update this commission' });
    }

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
        message: message || '',
        progress: progress || commissionData.progress
      }]
    };

    if (status === 'completed') {
      update.completedAt = timestamp;
    }

    await commissionRef.update(update);

    res.json({ 
      status: 'success',
      message: 'Commission status updated successfully',
      data: {
        status,
        timestamp
      }
    });
  } catch (error) {
    console.error('Error updating commission status:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error updating status', 
      error: error.message 
    });
  }
};

const getCommissionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const commissionDoc = await db.collection('commissions').doc(id).get();

    if (!commissionDoc.exists) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    const commissionData = commissionDoc.data();

    if (userId !== commissionData.clientId && userId !== commissionData.artistId) {
      return res.status(403).json({ message: 'Unauthorized to view this commission' });
    }

    res.json({
      status: 'success',
      data: {
        id: commissionDoc.id,
        ...commissionData
      }
    });
  } catch (error) {
    console.error('Error fetching commission:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching commission', 
      error: error.message 
    });
  }
};

const getUserCommissions = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { status, role } = req.query;

    let query = db.collection('commissions');

    if (role === 'client') {
      query = query.where('clientId', '==', userId);
    } else if (role === 'artist') {
      query = query.where('artistId', '==', userId);
    } else {
      const [clientCommissions, artistCommissions] = await Promise.all([
        query.where('clientId', '==', userId).get(),
        query.where('artistId', '==', userId).get()
      ]);

      const allCommissions = [
        ...clientCommissions.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...artistCommissions.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];

      return res.json({
        status: 'success',
        data: allCommissions
      });
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const commissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      status: 'success',
      data: commissions
    });
  } catch (error) {
    console.error('Error fetching user commissions:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching commissions', 
      error: error.message 
    });
  }
};

module.exports = {
  createCommission,
  updateCommissionStatus,
  getCommissionDetails,
  getUserCommissions,
  getPublicCommissions
};