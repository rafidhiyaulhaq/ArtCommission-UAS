const { db } = require('../config/firebase');

// Create new commission
const createCommission = async (req, res) => {
  try {
    const { title, description, price, artType, requirements } = req.body;
    const clientId = req.user.uid;

    const commissionRef = db.collection('commissions').doc();
    await commissionRef.set({
      title,
      description,
      price,
      artType,
      requirements,
      clientId,
      artistId: req.body.artistId,
      status: 'pending',
      progress: 0,
      timeline: {
        created: new Date().toISOString(),
        deadline: req.body.deadline || null,
        lastUpdate: new Date().toISOString()
      },
      files: [],
      revisions: []
    });

    res.status(201).json({
      id: commissionRef.id,
      message: 'Commission created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating commission', error: error.message });
  }
};

// Get commission by ID
const getCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const commissionDoc = await db.collection('commissions').doc(id).get();

    if (!commissionDoc.exists) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.json({
      id: commissionDoc.id,
      ...commissionDoc.data()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commission', error: error.message });
  }
};

// Update commission progress
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, status, message } = req.body;
    const timestamp = new Date().toISOString();

    const commissionRef = db.collection('commissions').doc(id);
    const commission = await commissionRef.get();

    if (!commission.exists) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    await commissionRef.update({
      progress,
      status,
      'timeline.lastUpdate': timestamp,
      updates: [...(commission.data().updates || []), {
        timestamp,
        message,
        progress,
        status
      }]
    });

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Submit final artwork
const submitArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileUrl, fileType } = req.body;

    const commissionRef = db.collection('commissions').doc(id);
    const commission = await commissionRef.get();

    if (!commission.exists) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    await commissionRef.update({
      status: 'completed',
      progress: 100,
      'timeline.completed': new Date().toISOString(),
      files: [...(commission.data().files || []), {
        url: fileUrl,
        type: fileType,
        uploadedAt: new Date().toISOString()
      }]
    });

    res.json({ message: 'Artwork submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting artwork', error: error.message });
  }
};

// Get all commissions for a user (either as artist or client)
const getUserCommissions = async (req, res) => {
  try {
    const userId = req.user.uid;

    const commissions = await db.collection('commissions')
      .where('clientId', '==', userId)
      .get();

    const artistCommissions = await db.collection('commissions')
      .where('artistId', '==', userId)
      .get();

    const allCommissions = [
      ...commissions.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...artistCommissions.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];

    res.json(allCommissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commissions', error: error.message });
  }
};

module.exports = {
  createCommission,
  getCommission,
  updateProgress,
  submitArtwork,
  getUserCommissions
};