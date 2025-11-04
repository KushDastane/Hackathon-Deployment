const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // This hides password by default in queries
  },
  role: {
    type: String,
    enum: ['hospital_staff', 'ambulance_staff', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: function() {
      return this.role === 'hospital_staff';
    }
  },
  ambulanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    required: function() {
      return this.role === 'ambulance_staff';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving - FIXED VERSION
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('User', userSchema);