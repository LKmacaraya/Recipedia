const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB database connection established successfully");
    
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch(err => {
    console.error("FATAL: Could not connect to MongoDB. Please check your MONGO_URI in the .env file.");
    console.error(err);
    process.exit(1);
  });


const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');

app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);


app.get('/', (req, res) => {
  res.send('Hello from Recipedia backend!');
}); 