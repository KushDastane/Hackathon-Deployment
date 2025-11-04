const express = require('express');
const Ambulance = require('../models/Ambulance');

const router = express.Router();

// Get all ambulances
router.get('/', async (req, res) => {
  try {
    const ambulances = await Ambulance.find().populate('staff');
    res.json(ambulances);
  } catch (error) {
    console.error('Get ambulances error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ambulance by 
router.get('/:id', async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id).populate('staff');
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }
    res.json(ambulance);
  } catch (error) {
    console.error('Get ambulance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ambulance location
router.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(ambulance);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;