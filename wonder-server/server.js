require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const placesRouter = require('./routes/places');
const agenciesRouter = require('./routes/agencies');
const chatRouter = require('./routes/chat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in your .env file!');
  process.exit(1);
}

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('🚀 Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/places', placesRouter);
app.use('/api/agencies', agenciesRouter);
app.use('/api/chat', chatRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Trigger nodemon restart