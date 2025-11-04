const mongoose = require('mongoose');
const User = require('../models/User');
const Ambulance = require('../models/Ambulance');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ambulance-system');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ambulance.deleteMany({});
    console.log('Cleared existing data');

    // Create an ambulance
    const ambulance = await Ambulance.create({
      ambulanceId: 'AMB001',
      licensePlate: 'MED123',
      model: 'Ford Transit',
      capacity: 4,
      equipment: ['Defibrillator', 'Oxygen', 'ECG Monitor'],
      status: 'available'
    });
    console.log('Created ambulance:', ambulance.ambulanceId);

    // Create hospital staff user
    const hospitalUser = await User.create({
      username: 'hospital1',
      email: 'hospital@example.com',
      password: 'password123', // Will be hashed automatically
      name: 'Dr.Rahul Patil',
      role: 'hospital_staff',
      department: 'Emergency Medicine'
    });
    console.log('Created hospital user:', hospitalUser.username);

    // Create ambulance staff user
    const ambulanceUser = await User.create({
      username: 'ambulance1',
      email: 'ambulance@example.com',
      password: 'password123', // Will be hashed automatically
      name: 'Pranav Wagh',
      role: 'ambulance_staff',
      ambulanceId: ambulance._id
    });
    console.log('Created ambulance user:', ambulanceUser.username);

    // Create admin user
    const adminUser = await User.create({
      username: 'admin1',
      email: 'admin@example.com',
      password: 'password123',
      name: 'System Administrator',
      role: 'admin'
    });
    console.log('Created admin user:', adminUser.username);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Hospital Staff: hospital1 / password123');
    console.log('Ambulance Staff: ambulance1 / password123');
    console.log('Admin: admin1 / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

seedDatabase();