const Place = require('../models/Place');

exports.getPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { country: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      };
    }
    const places = await Place.find(filter);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
