const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const EncryptionService = require('../utils/encryption');
const EmergencyClassifier = require('../utils/emergencyClassifier');

const handleSocketConnection = (io) => {
  io.use((socket, next) => {
    // Authenticate socket connection
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Join room based on user role
    if (socket.userRole === 'hospital_staff') {
      socket.join('hospital_staff');
    } else if (socket.userRole === 'ambulance_staff') {
      socket.join('ambulance_staff');
    }

    // Handle real-time vitals transmission
    socket.on('transmit_vitals', async (encryptedData) => {
      try {
        // Decrypt the transmitted data
        const decryptedData = EncryptionService.decrypt(encryptedData);
        const { patientId, vitals, location } = decryptedData;

        // Find patient and update vitals
        const patient = await Patient.findById(patientId);
        if (!patient) {
          socket.emit('error', 'Patient not found');
          return;
        }

        // Classify emergency level
        const emergencyLevel = EmergencyClassifier.classifyVitals(vitals);

        // Update patient data
        patient.vitals.push({
          ...vitals,
          timestamp: new Date()
        });
        patient.emergencyLevel = emergencyLevel;
        if (location) {
          patient.location = location;
        }

        await patient.save();
        await patient.populate('ambulanceId');

        // Encrypt data before broadcasting (for demonstration)
        const encryptedPatientData = EncryptionService.encrypt({
          patient: patient.toObject(),
          vitals: patient.vitals[patient.vitals.length - 1]
        });

        // Broadcast to hospital staff
        socket.to('hospital_staff').emit('patient_vitals_update', encryptedPatientData);

        // Send alert for critical patients
        if (emergencyLevel === 'critical') {
          socket.to('hospital_staff').emit('critical_alert', {
            patientId: patient._id,
            patientName: patient.name,
            emergencyLevel,
            timestamp: new Date()
          });
        }

        socket.emit('vitals_received', { status: 'success' });

      } catch (error) {
        console.error('Vitals transmission error:', error);
        socket.emit('error', 'Failed to process vitals data');
      }
    });

    // Handle ambulance location updates
    socket.on('update_location', async (data) => {
      try {
        const { ambulanceId, location } = data;
        
        // Broadcast location to hospital staff
        socket.to('hospital_staff').emit('ambulance_location_update', {
          ambulanceId,
          location,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Location update error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = { handleSocketConnection };