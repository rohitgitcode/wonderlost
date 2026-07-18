require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('Connected to DB. Running query...');
    try {
      const places = await Place.find({});
      console.log('Places count:', places.length);
      process.exit(0);
    } catch (e) {
      console.error('Query error:', e);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
