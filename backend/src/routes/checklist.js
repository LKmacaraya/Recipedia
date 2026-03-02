const express = require('express');
const router = express.Router();
const ChecklistItem = require('../models/ChecklistItem');
const { authenticateToken } = require('../middleware/auth');

// Get all checklist items for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await ChecklistItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new checklist item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const item = new ChecklistItem({
      user: req.user.id,
      text: req.body.text,
      done: false
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update a checklist item (text or done)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await ChecklistItem.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (typeof req.body.text === 'string') item.text = req.body.text;
    if (typeof req.body.done === 'boolean') item.done = req.body.done;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Delete a checklist item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await ChecklistItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
