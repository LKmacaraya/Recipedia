const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get current user's username and email
router.get('/me', auth.authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update username, email, password
router.put('/settings', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;
    const update = {};
    if (username) {
      // Check if username is taken by another user
      const existing = await User.findOne({ username, _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      update.username = username;
    }
    if (email) update.email = email;
    if (password && password.length >= 6) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Account updated successfully', username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
