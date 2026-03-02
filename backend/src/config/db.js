const mongoose = require('mongoose');

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI.');
  }

  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

module.exports = { connectToDatabase };
