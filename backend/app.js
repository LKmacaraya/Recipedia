// ... other requires
const express = require('express');
const profileRoutes = require('./routes/profile');
const avatarUploadRoutes = require('./routes/avatarUpload');
const path = require('path');
// ... other app.use()
app.use('/api/profile', profileRoutes);
app.use('/api/avatar', avatarUploadRoutes);
app.use('/uploads', require('express').static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ... rest of file
