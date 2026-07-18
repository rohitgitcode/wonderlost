const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);
