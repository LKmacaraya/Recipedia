// ... other requires
const express = require('express');
const profileRoutes = require('./routes/profile');
const userSettingsRoutes = require('./routes/userSettings');
const avatarUploadRoutes = require('./routes/avatarUpload');
const postsRoutes = require('./routes/posts');
const checklistRoutes = require('./routes/checklist');
const path = require('path');
// ... other app.use()
app.use('/api/profile', profileRoutes);
app.use('/api/users', userSettingsRoutes);
app.use('/api/avatar', avatarUploadRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/uploads', require('express').static(path.join(__dirname, 'uploads')));

module.exports = app;

