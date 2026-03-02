const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all recipes for the logged-in user, with optional search
router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };
    if (search) {
      query.$text = { $search: search };
    }
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new recipe
router.post('/', auth.authenticateToken, async (req, res) => {
  try {
    const { name, image, steps } = req.body;
    if (!name || !image || !steps) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    const recipe = new Recipe({
      name,
      image,
      steps,
      userId: req.user._id
    });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a recipe
router.put('/:id', auth.authenticateToken, async (req, res) => {
  try {
    const { name, image, steps } = req.body;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, image, steps },
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a recipe
router.delete('/:id', auth.authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a post as a recipe for the current user, with owner credit
router.post('/from-post/:postId', auth.authenticateToken, async (req, res) => {
  try {
    const Post = require('../models/Post');
    const post = await Post.findById(req.params.postId).populate('user', 'username avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    // Prevent duplicate saves (same post, same user)
    const existing = await Recipe.findOne({ userId: req.user._id, ownerId: post.user._id, name: post.title });
    if (existing) return res.status(400).json({ message: 'Recipe already saved' });
    const recipe = new Recipe({
      name: post.title,
      image: post.image,
      steps: post.steps,
      userId: req.user._id,
      ownerId: post.user._id,
      ownerName: post.user.username,
      ownerAvatar: post.user.avatar || '',
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
