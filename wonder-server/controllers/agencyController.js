const Agency = require('../models/Agency');

exports.getAgencies = async (req, res) => {
  try {
    const { placeId, maxBudget, services, query } = req.query;
    let filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { servicesOffered: { $regex: query, $options: 'i' } }
      ];
    }

    if (placeId) {
      filter.servingPlaces = placeId;
    }
    
    // We only filter if maxBudget is provided
    if (maxBudget) {
      filter.maxBudget = { $lte: Number(maxBudget) };
    }
    
    if (services) {
      const servicesArray = services.split(',');
      filter.servicesOffered = { $all: servicesArray };
    }

    const agencies = await Agency.find(filter).populate('servingPlaces');
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerAgency = async (req, res) => {
  try {
    const { name, contactPhone, contactEmail, instagramHandle, maxBudget, servingPlaces, servicesOffered, packages } = req.body;
    
    const newAgency = new Agency({
      name,
      contactPhone,
      contactEmail,
      instagramHandle,
      maxBudget,
      servingPlaces,
      servicesOffered: servicesOffered || [],
      packages: packages || []
    });

    const savedAgency = await newAgency.save();
    res.status(201).json(savedAgency);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
