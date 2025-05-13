const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

// It helps to get communication logs for the campaign
router.get('/', auth, async (req, res) => {
  try {
    const { campaignId } = req.query;
    if (!campaignId)
       {
      return res.status(400).json({ message: 'campaignId is required' });
    }
    const logs = await CommunicationLog.find({ campaignId })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 