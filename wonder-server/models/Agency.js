const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  instagramHandle: { type: String },
  maxBudget: { type: Number, required: true },
  servingPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  servicesOffered: { type: [String], default: [] },
  packages: [{
    title: { type: String },
    description: { type: String },
    price: { type: Number }
  }],
  rating: { type: Number, default: 5.0 },
  reviews: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Agency', agencySchema);
