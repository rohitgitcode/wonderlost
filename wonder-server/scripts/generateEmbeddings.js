require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Place = require('../models/Place');
const Agency = require('../models/Agency');

// Import Transformers.js
const { pipeline } = require('@xenova/transformers');

const generateEmbeddings = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in your .env file!');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    console.log('Fetching Places and Agencies from DB...');
    const places = await Place.find({});
    const agencies = await Agency.find({});

    console.log('Loading local embedding model (Xenova/all-MiniLM-L6-v2)... this may take a moment on first run to download ~22MB.');
    // Initialize the feature extraction pipeline
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    let dbChunks = [];

    // Process Places
    console.log(`Processing ${places.length} Places...`);
    for (const place of places) {
      const textChunk = `Destination: ${place.name} located in ${place.country}. Description: ${place.description} Features: ${place.tags.join(', ')}`;
      const output = await extractor(textChunk, { pooling: 'mean', normalize: true });
      
      // The output is a Tensor. We convert it to a flat array.
      const embedding = Array.from(output.data);
      
      dbChunks.push({
        _id: place._id,
        type: 'places',
        text: textChunk,
        embedding: embedding
      });
    }

    // Process Agencies
    console.log(`Processing ${agencies.length} Agencies...`);
    for (const agency of agencies) {
      const services = agency.servicesOffered ? agency.servicesOffered.join(', ') : '';
      const packagesText = agency.packages ? agency.packages.map(p => p.title).join(', ') : '';
      const textChunk = `Travel Agency: ${agency.name}. Services offered: ${services}. Maximum budget required: ${agency.maxBudget}. Packages: ${packagesText}`;
      
      const output = await extractor(textChunk, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);
      
      dbChunks.push({
        _id: agency._id,
        type: 'agencies',
        text: textChunk,
        embedding: embedding
      });
    }

    // Save to data directory
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    const outputPath = path.join(dataDir, 'embeddings.json');
    fs.writeFileSync(outputPath, JSON.stringify(dbChunks));
    console.log(`Successfully saved ${dbChunks.length} embeddings to ${outputPath}`);

  } catch (error) {
    console.error('Error generating embeddings:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

generateEmbeddings();
