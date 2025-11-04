const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login route - FIXED VERSION
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username); // Debug log

    // Validate input
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false,
        error: 'Username and password are required' 
      });
    }

    // Find user by username OR email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username } // Allow login with email too
      ]
    }).select('+password'); // Important: include password field

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials - user not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Compare passwords - FIXED: await the comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid); // Debug log

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials - wrong password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret_key_2024',
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      ambulanceId: user.ambulanceId
    };

    console.log('Login successful for user:', user.username); // Debug log

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
});

module.exports = router;