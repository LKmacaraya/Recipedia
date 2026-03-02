const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user's profile
router.get('/me', auth.authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found for id:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      // If profile doesn't exist, create a default one
      profile = new Profile({
        userId: req.user.id,
        name: user.name || user.username || 'Unnamed User',
        email: user.email,
        avatar: '',
        address: '',
        gender: 'Rather not Say',
        hobbies: '',
        bio: ''
      });
      await profile.save();
      console.log('Created new profile for user:', req.user.id);
    } else if (profile.email !== user.email) {
      // Sync email if changed
      profile.email = user.email;
      await profile.save();
      console.log('Synced profile email for user:', req.user.id);
    }
    res.json(profile);
  } catch (err) {
    console.error('Error in GET /api/profile/me:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update current user's profile
router.put('/me', auth.authenticateToken, async (req, res) => {
  try {
    console.log('Profile update body:', req.body);
    // Ignore email from req.body, always use User.email
    const { name, address, gender, hobbies, bio, avatar } = req.body;
    const user = await User.findById(req.user.id);
    const updateFields = {
      name,
      address,
      gender,
      hobbies,
      bio,
      avatar,
      email: user.email // always use user's current email
    };
    let profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateFields },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile by userId (for admin or public viewing)
const mongoose = require('mongoose');

router.get('/:userId', auth.authenticateToken, async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId.isValid(req.params.userId)
      ? new mongoose.Types.ObjectId(req.params.userId)
      : null;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      // Create a default profile if missing, like /me
      profile = new Profile({
        userId,
        name: user.username,
        email: user.email,
        avatar: '',
        address: '',
        gender: 'Rather not Say',
        hobbies: '',
        bio: ''
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
