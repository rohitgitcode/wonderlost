const Place = require('../models/Place');
const Agency = require('../models/Agency');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('@xenova/transformers');

let embeddings = [];
let extractor = null;

// Load embeddings into memory
const loadEmbeddings = () => {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'embeddings.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      embeddings = JSON.parse(data);
      console.log(`Loaded ${embeddings.length} embeddings for Ghumakkad.`);
    }
  } catch (err) {
    console.error('Error loading embeddings:', err);
  }
};
loadEmbeddings();

// Helper to compute dot product (cosine similarity for normalized vectors)
const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);

exports.processChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: 'Please send a message.', type: 'text' });
    }
    
    // 1. Exact Match Greetings
    const text = message.toLowerCase();
    if (text.match(/^(hi|hello|hey|greetings|namaste)[\s\!\.]*$/)) {
      return res.json({
        reply: "Namaste! I'm Ghumakkad 🎒, your friendly travel buddy. Ask me about your dream destinations or what kind of agencies you need!",
        type: 'text'
      });
    }

    if (embeddings.length === 0) {
      return res.status(500).json({ reply: "My brain is currently updating! Please run the embeddings script first.", type: 'text' });
    }

    // 2. Pre-processing: Explicit Place Intent
    // If the user mentions a specific place by name (e.g., "tell me about goa" or "agencies for goa")
    const allPlaces = await Place.find({}, 'name');
    let mentionedPlace = null;
    for (const p of allPlaces) {
      const placeWords = p.name.toLowerCase().split(/\s+/);
      for (const word of placeWords) {
        if (word.length > 2 && new RegExp(`\\b${word}\\b`, 'i').test(text)) {
          mentionedPlace = p;
          break;
        }
      }
      if (mentionedPlace) break;
    }

    if (mentionedPlace) {
      const isAgencyIntent = text.match(/(agency|agencies|package|packages|hotel|hotels|tour|tours)/);
      if (isAgencyIntent) {
        const agencies = await Agency.find({ servingPlaces: mentionedPlace._id });
        if (agencies.length > 0) {
          return res.json({
            reply: `Here are the travel agencies offering packages for ${mentionedPlace.name}:`,
            type: 'agencies',
            data: agencies
          });
        }
      } else {
        const placeDoc = await Place.findById(mentionedPlace._id);
        if (placeDoc) {
          return res.json({
            reply: `Here is some information about ${mentionedPlace.name}!`,
            type: 'places',
            data: [placeDoc]
          });
        }
      }
    }

    // Lazy load the embedding pipeline
    if (!extractor) {
      console.log('Loading Xenova pipeline...');
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    // 3. Embed the query (Semantic Fallback)
    const output = await extractor(message, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(output.data);

    // 4. Calculate Cosine Similarity
    const scored = embeddings.map(item => ({
      ...item,
      score: dotProduct(queryEmbedding, item.embedding)
    }));

    // Sort by highest score
    scored.sort((a, b) => b.score - a.score);

    // Filter top matches above a threshold (0.32 is a good baseline for MiniLM)
    const topMatches = scored.filter(item => item.score > 0.32).slice(0, 3);

    if (topMatches.length > 0) {
      // Group by type based on the BEST match
      const primaryType = topMatches[0].type;
      const matchedIds = topMatches.filter(m => m.type === primaryType).map(m => m._id);
      
      if (primaryType === 'places') {
        const places = await Place.find({ _id: { $in: matchedIds } });
        return res.json({
          reply: `I found some great places matching what you're looking for!`,
          type: 'places',
          data: places
        });
      } else {
        const agencies = await Agency.find({ _id: { $in: matchedIds } });
        return res.json({
          reply: `Here are some highly-rated travel agencies that fit your needs!`,
          type: 'agencies',
          data: agencies
        });
      }
    }

    // 5. Fallback (Anti-Hallucination)
    return res.json({
      reply: "i cant answer this okyy",
      type: 'text'
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Something went wrong with Ghumakkad.' });
  }
};
