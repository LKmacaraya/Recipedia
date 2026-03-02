const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello from Recipedia backend!');
});

module.exports = app;
