const express = require('express');
const Patient = require('../models/Patient');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('ambulanceId')
      .sort({ createdAt: -1 });
    
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('ambulanceId');
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new patient (ambulance staff only)
router.post('/', requireRole(['ambulance_staff', 'admin']), async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      ambulanceId: req.user.ambulanceId || req.body.ambulanceId
    };

    const patient = new Patient(patientData);
    await patient.save();

    // Populate ambulance data before sending response
    await patient.populate('ambulanceId');

    res.status(201).json(patient);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update patient vitals
router.post('/:id/vitals', requireRole(['ambulance_staff', 'admin']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const newVitals = req.body;
    patient.vitals.push(newVitals);

    // Update emergency level based on new vitals
    const EmergencyClassifier = require('../utils/emergencyClassifier');
    patient.emergencyLevel = EmergencyClassifier.classifyVitals(newVitals);

    await patient.save();
    await patient.populate('ambulanceId');

    res.json(patient);
  } catch (error) {
    console.error('Update vitals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get critical patients
router.get('/alerts/critical', async (req, res) => {
  try {
    const criticalPatients = await Patient.find({ emergencyLevel: 'critical' })
      .populate('ambulanceId')
      .sort({ updatedAt: -1 });
    
    res.json(criticalPatients);
  } catch (error) {
    console.error('Get critical patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;