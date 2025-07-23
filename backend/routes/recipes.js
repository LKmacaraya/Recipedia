const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all recipes for the logged-in user, with optional search
router.get('/', auth, async (req, res) => {
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
router.post('/', auth, async (req, res) => {
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
router.put('/:id', auth, async (req, res) => {
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
router.delete('/:id', auth, async (req, res) => {
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

module.exports = router;
