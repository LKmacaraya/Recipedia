const express = require('express');

const authRoutes = require('./auth');
const recipeRoutes = require('./recipes');
const profileRoutes = require('./profile');
const avatarUploadRoutes = require('./avatarUpload');
const userSettingsRoutes = require('./userSettings');
const postsRoutes = require('./posts');
const checklistRoutes = require('./checklist');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/profile', profileRoutes);
router.use('/avatar', avatarUploadRoutes);
router.use('/users', userSettingsRoutes);
router.use('/posts', postsRoutes);
router.use('/checklist', checklistRoutes);

module.exports = router;
