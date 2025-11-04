// backend/scripts/seed.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Ambulance = require('../models/Ambulance');
const Patient = require('../models/Patient');

const seedDatabase = async () => {
  await mongoose.connect('mongodb://localhost:27017/ambulance-system');

  // Clear existing data
  await User.deleteMany();
  await Ambulance.deleteMany();
  await Patient.deleteMany();

  // Create ambulances
  const ambulance1 = await Ambulance.create({
    ambulanceId: 'AMB001',
    licensePlate: 'MED123',
    model: 'Ford Transit',
    capacity: 4,
    equipment: ['Defibrillator', 'Oxygen', 'ECG Monitor'],
    status: 'on_mission'
  });

  // Create users
  await User.create({
    username: 'hospital1',
    email: 'hospital@example.com',
    password: 'password123',
    name: 'Dr.Rahul Patil',
    role: 'hospital_staff',
    department: 'Emergency'
  });

  await User.create({
    username: 'ambulance1',
    email: 'ambulance@example.com',
    password: 'password123',
    name: 'Pranav Wagh',
    role: 'ambulance_staff',
    ambulanceId: ambulance1._id
  });

  // Create sample patients
  await Patient.create({
    patientId: 'PAT001',
    name: 'Ankita Pawar',
    age: 45,
    gender: 'female',
    emergencyContact: {
      name: 'Shree Pawar',
      phone: '+91 7218573757',
      relationship: 'Husband'
    },
    medicalHistory: ['Hypertension'],
    allergies: ['Penicillin'],
    ambulanceId: ambulance1._id,
    vitals: [{
      heartRate: 85,
      bloodPressure: { systolic: 120, diastolic: 80 },
      spo2: 98,
      temperature: 36.8,
      respiratoryRate: 16,
      timestamp: new Date()
    }],
    emergencyLevel: 'stable'
  });

  console.log('Database seeded successfully!');
  process.exit(0);
};

seedDatabase().catch(console.error);