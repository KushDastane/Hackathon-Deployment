const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  ambulanceId: {
    type: String,
    required: true,
    unique: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  model: String,
  capacity: {
    type: Number,
    min: 1,
    max: 10
  },
  equipment: [String],
  status: {
    type: String,
    enum: ['available', 'on_mission', 'maintenance', 'offline'],
    default: 'available'
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ambulance', ambulanceSchema);