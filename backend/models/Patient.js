const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  heartRate: {
    type: Number,
    required: true,
    min: 0,
    max: 300
  },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true }
  },
  spo2: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  temperature: {
    type: Number,
    required: true,
    min: 30,
    max: 45
  },
  ecg: {
    type: [Number], // Array of ECG data points
    default: []
  },
  respiratoryRate: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalHistory: [String],
  currentMedications: [String],
  allergies: [String],
  ambulanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    required: true
  },
  vitals: [vitalsSchema],
  emergencyLevel: {
    type: String,
    enum: ['critical', 'moderate', 'stable'],
    default: 'stable'
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['en_route', 'arrived', 'discharged'],
    default: 'en_route'
  },
  assignedDoctor: String,
  notes: [String]
}, {
  timestamps: true
});

// Index for efficient querying
patientSchema.index({ ambulanceId: 1, createdAt: -1 });
patientSchema.index({ emergencyLevel: 1 });

module.exports = mongoose.model('Patient', patientSchema);