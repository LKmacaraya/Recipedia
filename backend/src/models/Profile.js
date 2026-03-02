const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Rather not Say'], default: 'Rather not Say' },
  hobbies: { type: String, default: '' },
  email: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
