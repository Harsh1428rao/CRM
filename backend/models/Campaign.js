const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetSegment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  stats: {
    totalAudience: {
      type: Number,
      default: 0
    },
    delivered: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // add some  index for better query performance
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  scheduledFor: Date,
  completedAt: Date
}, {
  timestamps: true
});

// added some of the  pre-save middleware
campaignSchema.pre('save', function(next) {
  console.log('Pre-save middleware - Campaign object:', {
    _id: this._id,
    name: this.name,
    createdBy: this.createdBy
  });
  
  if (!this.createdBy) {
    console.error('Campaign missing createdBy before save');
    next(new Error('createdBy is required'));
    return;
  }
  
  // Ensure createdBy is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(this.createdBy)) {
    console.error('Invalid createdBy ObjectId:', this.createdBy);
    next(new Error('Invalid createdBy ObjectId'));
    return;
  }
  
  next();
});
// Added some post-save middleware to verify the save
campaignSchema.post('save', function(doc) {
  console.log('Post-save middleware - Saved campaign:', {
    
    _id: doc._id,
    name: doc.name,



    createdBy: doc.createdBy
  });
});

module.exports = mongoose.model('Campaign', campaignSchema); 
//In this we are creating the campaign schema with the mongoose