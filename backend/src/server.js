const path = require('path');
const dotenv = require('dotenv');

const app = require('./app');
const { connectToDatabase } = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('FATAL: Could not connect to MongoDB.');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
