const express = require('express');
const router = express.Router();
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

// Get all segments
router.get('/', auth, async (req, res) => {
  try {
    const segments = await Segment.find({ createdBy: req.user._id });
    res.json(segments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single segment
router.get('/:id', auth, async (req, res) => {
  try {
    const segment = await Segment.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    res.json(segment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to evaluate segment rules and return matching customer IDs
async function getMatchingCustomerIds(rules) {
  const query = buildMongoQuery(rules);
  const customers = await Customer.find(query, '_id');
  return customers.map(c => c._id);
}

// Create segment
router.post('/', auth, async (req, res) => {
  try {
    const matchingCustomerIds = await getMatchingCustomerIds(req.body.rules);

    const segment = new Segment({
      name: req.body.name,
      description: req.body.description,
      rules: req.body.rules,
      createdBy: req.user._id,
      customers: matchingCustomerIds,
      customerCount: matchingCustomerIds.length
    });

    const newSegment = await segment.save();
    res.status(201).json(newSegment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update segment
router.patch('/:id', auth, async (req, res) => {
  try {
    const segment = await Segment.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    if (req.body.rules) {
      const matchingCustomerIds = await getMatchingCustomerIds(req.body.rules);
      segment.customers = matchingCustomerIds;
      segment.customerCount = matchingCustomerIds.length;
    }

    Object.keys(req.body).forEach(key => {
      segment[key] = req.body[key];
    });

    segment.lastUpdated = Date.now();
    const updatedSegment = await segment.save();
    res.json(updatedSegment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete segment
router.delete('/:id', auth, async (req, res) => {
  try {
    const segment = await Segment.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    await segment.remove();
    res.json({ message: 'Segment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Preview segment size
router.post('/preview', auth, async (req, res) => {
  try {
    const customerCount = await evaluateSegmentRules(req.body.rules);
    res.json({ customerCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to evaluate segment rules
async function evaluateSegmentRules(rules) {
  const query = buildMongoQuery(rules);
  return await Customer.countDocuments(query);
}

// Helper function to build MongoDB query from rules
function buildMongoQuery(rules) {
  if (!rules || !rules.conditions) {
    return {};
  }

  const { operator, conditions } = rules;
  const mongoConditions = conditions.map(condition => {
    const { field, operator, value } = condition;
    let query = {};

    switch (operator) {
      case 'equals':
        query[field] = value;
        break;
      case 'notEquals':
        query[field] = { $ne: value };
        break;
      case 'greaterThan':
        query[field] = { $gt: value };
        break;
      case 'lessThan':
        query[field] = { $lt: value };
        break;
      case 'contains':
        query[field] = { $regex: value, $options: 'i' };
        break;
      case 'in':
        query[field] = { $in: value };
        break;
      case 'notIn':
        query[field] = { $nin: value };
        break;
      case 'dateBefore':
        query[field] = { $lt: new Date(value) };
        break;
      case 'dateAfter':
        query[field] = { $gt: new Date(value) };
        break;
    }

    return query;
  });

  return operator === 'AND' 
    ? { $and: mongoConditions }
    : { $or: mongoConditions };
}

module.exports = router; 