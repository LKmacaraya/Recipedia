const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticateToken } = require('../middleware/auth');

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatar' }
      });
    // Remove deprecated fields and always use populated user.avatar/username
    const Profile = require('../models/Profile');
    // Attach avatar from Profile for each post's user
    const postsWithAvatar = await Promise.all(posts.map(async post => {
      const plain = post.toObject();
      if (plain.user && plain.user._id) {
        const profile = await Profile.findOne({ userId: plain.user._id });
        plain.user.avatar = profile ? profile.avatar : '';
        plain.userAvatar = undefined;
        plain.username = undefined;
      }
      // Ensure currentPostUserId is always included
      plain.currentPostUserId = post.currentPostUserId;
      if (plain.comments) {
        plain.comments = await Promise.all(plain.comments.map(async c => {
          if (c.user && c.user._id) {
            const profile = await Profile.findOne({ userId: c.user._id });
            c.user.avatar = profile ? profile.avatar : '';
            c.userAvatar = undefined;
            c.username = undefined;
          }
          return c;
        }));
      }
      return plain;
    }));
    res.json(postsWithAvatar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, image, steps } = req.body;
    const Profile = require('../models/Profile');
    const profile = await Profile.findOne({ userId: req.user.id });
    const avatar = profile ? profile.avatar : '';
    const post = new Post({
      user: mongoose.Types.ObjectId(req.user.id),
      currentPostUserId: String(req.user.id),
      username: req.user.username,
      userAvatar: avatar,
      title,
      image,
      steps,
    });
    await post.save();
    // Ensure currentPostUserId is included in the response
    const postObj = post.toObject();
    postObj.currentPostUserId = post.currentPostUserId;
    res.status(201).json(postObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Heart/unheart a post
router.post('/:id/heart', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user.id;
    const index = post.hearts.indexOf(userId);
    if (index === -1) {
      post.hearts.push(userId);
    } else {
      post.hearts.splice(index, 1);
    }
    await post.save();
    res.json({ hearts: post.hearts });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Save/unsave a post
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user.id;
    const index = post.saves.indexOf(userId);
    if (index === -1) {
      post.saves.push(userId);
    } else {
      post.saves.splice(index, 1);
    }
    await post.save();
    res.json({ saves: post.saves });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a comment to a post
router.post('/:id/comment', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const Profile = require('../models/Profile');
    const profile = await Profile.findOne({ userId: req.user.id });
    const avatar = profile ? profile.avatar : '';
    const comment = new Comment({
      post: post._id,
      user: req.user.id,
      username: req.user.username,
      userAvatar: avatar,
      text
    });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate('user', 'username avatar');
    res.json(comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post (only owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
