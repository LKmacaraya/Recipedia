const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentPostUserId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  steps: {
    type: String,
    required: true
  },
  hearts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
