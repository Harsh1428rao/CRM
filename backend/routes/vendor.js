const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');
const Campaign = require('../models/Campaign');

// Delivery Receipt API
router.post('/receipt', async (req, res) => {
  const { logId, status } = req.body;
  try {
    console.log('Vendor receipt for logId:', logId, 'status:', status);
    const log = await CommunicationLog.findById(logId);
    if (!log) return res.status(404).json({ message: 'Log not found' });

    log.status = status;
    log.deliveryTime = new Date();
    await log.save();

    // Update campaign stats
    const delivered = await CommunicationLog.countDocuments({ campaignId: log.campaignId, status: 'SENT' });
    const failed = await CommunicationLog.countDocuments({ campaignId: log.campaignId, status: 'FAILED' });

    await Campaign.findByIdAndUpdate(log.campaignId, {
      'stats.delivered': delivered,
      'stats.failed': failed
    });

    res.json({ message: 'Delivery receipt updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery receipt', error: error.message });
  }
});

module.exports = router; 