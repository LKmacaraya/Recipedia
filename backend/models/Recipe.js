const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  steps: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true  // Now optional
  },
  ownerName: {
    type: String,
    // required: true  // Now optional
  },
  ownerAvatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for search functionality
RecipeSchema.index({ name: 'text', steps: 'text' });

module.exports = mongoose.model('Recipe', RecipeSchema);
