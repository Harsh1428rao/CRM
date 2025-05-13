const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const Queue = require('bull');
const { OpenAI } = require('openai');
const CommunicationLog = require('../models/CommunicationLog');
const axios = require('axios');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create Bull queue for campaign processing
const campaignQueue = new Queue('campaign-delivery', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

function personalizeMessage(template, customer) {
  // Replace {name} with customer name
  return template.replace('{name}', customer.name);
}

// Process campaign delivery jobs
campaignQueue.process(async (job) => {
  const { campaignId } = job.data;
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error('Campaign not found');

  const segment = await Segment.findById(campaign.targetSegment);
  if (!segment) throw new Error('Segment not found');

  const customers = await Customer.find({ _id: { $in: segment.customers } });

  for (const customer of customers) {
    const personalizedMsg = campaign.message.replace('{name}', customer.name);

    const log = await CommunicationLog.create({
      campaignId: campaign._id,
      customerId: customer._id,
      message: personalizedMsg,
      status: 'PENDING'
    });

    console.log('Simulating delivery for customer:', customer._id, 'logId:', log._id);

    setTimeout(async () => {
      const isSuccess = Math.random() < 0.9;
      const status = isSuccess ? 'SENT' : 'FAILED';

      try {
        console.log('Calling vendor receipt for logId:', log._id, 'status:', status);
        await axios.post('http://localhost:5000/api/vendor/receipt', {
          logId: log._id,
          status
        });
      } catch (err) {
        console.error('Vendor callback failed:', err.message);
      }
    }, 100);
  }

  setTimeout(async () => {
    campaign.status = 'completed';
    await campaign.save();
    console.log('Campaign marked as completed:', campaign._id);
  }, customers.length * 200);
});

// Get all campaigns
router.get('/', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('targetSegment')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single campaign
router.get('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('targetSegment');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create campaign
router.post('/', auth, async (req, res) => {
  try {
    // Detailed logging
    console.log('=== Campaign Creation Request ===');
    console.log('Headers:', req.headers);
    console.log('User object:', req.user);
    console.log('User ID:', req.user?._id);
    console.log('Request body:', req.body);

    // Validate user
    if (!req.user || !req.user._id) {
      console.error('No user or user ID in request');
      return res.status(401).json({ 
        message: 'User not authenticated',
        details: {
          user: req.user,
          userId: req.user?._id
        }
      });
    }

    // Fetch the segment to get the audience size
    const segment = await Segment.findById(req.body.targetSegment);

    // Create campaign data with explicit createdBy and correct audience size
    const campaignData = {
      name: req.body.name,
      description: req.body.description,
      targetSegment: req.body.targetSegment,
      message: req.body.message,
      status: 'pending',
      createdBy: req.user._id,
      stats: {
        totalAudience: segment ? segment.customers.length : 0,
        delivered: 0,
        failed: 0
      }
    };

    console.log('Campaign data before creation:', campaignData);

    // Create campaign using the data object
    const campaign = new Campaign(campaignData);

    // Log the campaign object
    console.log('Campaign object before save:', {
      _id: campaign._id,
      name: campaign.name,
      createdBy: campaign.createdBy,
      targetSegment: campaign.targetSegment
    });

    // Validate the campaign object
    const validationError = campaign.validateSync();
    if (validationError) {
      console.error('Campaign validation error:', validationError);
      return res.status(400).json({
        message: 'Validation error',
        details: Object.keys(validationError.errors).reduce((acc, key) => {
          acc[key] = validationError.errors[key].message;
          return acc;
        }, {})
      });
    }

    // Save the campaign
    const newCampaign = await campaign.save();
    console.log('Campaign saved successfully:', {
      _id: newCampaign._id,
      name: newCampaign.name,
      createdBy: newCampaign.createdBy
    });

    // Add campaign to queue
    campaignQueue.add({ campaignId: newCampaign._id });

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Campaign creation error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        details: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(400).json({ 
      message: error.message,
      details: error.errors || error.details || {}
    });
  }
});

// Update campaign
router.patch('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (req.body.name) campaign.name = req.body.name;
    if (req.body.description) campaign.description = req.body.description;
    if (req.body.targetSegment) campaign.targetSegment = req.body.targetSegment;
    if (req.body.message) campaign.message = req.body.message;
    if (req.body.status) campaign.status = req.body.status;

    const updatedCampaign = await campaign.save();
    res.json(updatedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete campaign
router.delete('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.remove();
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get campaign suggestions
router.post('/suggest-messages', auth, async (req, res) => {
  try {
    const { description, segment } = req.body;

    const prompt = `Generate 3 marketing campaign messages for the following campaign:
    Description: ${description}
    Target Segment: ${segment}
    
    The messages should be:
    1. Professional and engaging
    2. Tailored to the target segment
    3. Clear and concise
    4. Include a call to action`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      n: 3
    });

    const suggestions = completion.choices.map(choice => choice.message.content);
    res.json(suggestions);
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in /api/campaigns/suggest-messages:', error);
    res.status(500).json({
      message: error.message,
      details: error.response?.data || error.stack || error
    });
  }
});

// Get campaign statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments();
    const totalDelivered = await Campaign.aggregate([
      { $group: { _id: null, total: { $sum: '$stats.delivered' } } }
    ]);
    const totalFailed = await Campaign.aggregate([
      { $group: { _id: null, total: { $sum: '$stats.failed' } } }
    ]);

    const statusCounts = await Campaign.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalCampaigns,
      totalDelivered: totalDelivered[0]?.total || 0,
      totalFailed: totalFailed[0]?.total || 0,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 