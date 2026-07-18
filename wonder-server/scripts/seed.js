require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');
const Agency = require('../models/Agency');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-de';

const seedPlaces = [
  { name: 'Goa Beaches', country: 'India', description: 'Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage.', tags: ['Tropical', 'Relaxing', 'Thrill', 'Medium', 'Friends', 'Beach'], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Kerala Backwaters', country: 'India', description: 'Tranquil network of canals, lakes, and estuaries perfect for houseboat cruises.', tags: ['Tropical', 'Relaxing', 'Nature', 'High', 'Couple', 'Nature'], imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Jaipur (Pink City)', country: 'India', description: 'Rich in history, majestic forts, palaces, and vibrant markets.', tags: ['Moderate', 'Balanced', 'History', 'Medium', 'Family', 'Culture'], imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Manali', country: 'India', description: 'A high-altitude Himalayan resort town known for skiing, trekking, and adventure.', tags: ['Cool', 'Intense', 'Thrill', 'Medium', 'Friends', 'Mountain'], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Varanasi', country: 'India', description: 'The spiritual capital of India, known for its sacred ghats along the Ganges.', tags: ['Moderate', 'Intense', 'History', 'Low', 'Solo', 'Spiritual'], imageUrl: 'https://loremflickr.com/800/600/varanasi,ghat,temple/all' }, 
  { name: 'Andaman Islands', country: 'India', description: 'Crystal clear waters, coral reefs, and white-sand beaches.', tags: ['Tropical', 'Relaxing', 'Nature', 'High', 'Couple', 'Beach'], imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Rishikesh', country: 'India', description: 'The Yoga capital of the world and a hub for white water rafting.', tags: ['Cool', 'Intense', 'Thrill', 'Low', 'Solo', 'Spiritual', 'Mountain'], imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Mumbai', country: 'India', description: 'The city of dreams, Bollywood, fast-paced life, and Marine Drive.', tags: ['Tropical', 'Intense', 'Culture', 'Medium', 'Friends', 'City'], imageUrl: 'https://loremflickr.com/800/600/mumbai,gateway/all' },
  { name: 'Delhi', country: 'India', description: 'The capital city blending rich history with vibrant street food culture.', tags: ['Moderate', 'Intense', 'History', 'Low', 'Family', 'City'], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Bangalore', country: 'India', description: 'The Silicon Valley of India, known for its pleasant weather and parks.', tags: ['Moderate', 'Balanced', 'Nature', 'Medium', 'Friends', 'City'], imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Udaipur', country: 'India', description: 'The City of Lakes, featuring stunning royal palaces and romantic boat rides.', tags: ['Moderate', 'Relaxing', 'History', 'High', 'Couple', 'Culture'], imageUrl: 'https://loremflickr.com/800/600/udaipur,palace,lake/all' },
  { name: 'Agra', country: 'India', description: 'Home to the magnificent Taj Mahal, a testament to eternal love.', tags: ['Moderate', 'Balanced', 'History', 'Medium', 'Family', 'Culture'], imageUrl: 'https://loremflickr.com/800/600/agra,tajmahal/all' },
  { name: 'Darjeeling', country: 'India', description: 'Beautiful tea gardens and panoramic views of the Himalayas.', tags: ['Cool', 'Relaxing', 'Nature', 'Medium', 'Family', 'Mountain'], imageUrl: 'https://loremflickr.com/800/600/darjeeling,tea/all' },
  { name: 'Amritsar', country: 'India', description: 'Home to the golden temple, offering a deeply spiritual experience.', tags: ['Moderate', 'Relaxing', 'Culture', 'Low', 'Family', 'Spiritual'], imageUrl: 'https://loremflickr.com/800/600/amritsar,temple,golden/all' },
  { name: 'Mysore', country: 'India', description: 'Known for its royal heritage, silk, and the grand Mysore Palace.', tags: ['Moderate', 'Balanced', 'History', 'Low', 'Family', 'Culture'], imageUrl: 'https://loremflickr.com/800/600/mysore,palace/all' },
  { name: 'Shimla', country: 'India', description: 'A classic hill station with colonial architecture and scenic mountain views.', tags: ['Cool', 'Relaxing', 'Nature', 'High', 'Couple', 'Mountain'], imageUrl: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Ooty', country: 'India', description: 'The Queen of Hill Stations, famous for eucalyptus trees and toy trains.', tags: ['Cool', 'Relaxing', 'Nature', 'Medium', 'Family', 'Mountain'], imageUrl: 'https://loremflickr.com/800/600/ooty,nature/all' },
  { name: 'Munnar', country: 'India', description: 'Rolling hills draped in emerald-green tea plantations.', tags: ['Cool', 'Relaxing', 'Nature', 'Medium', 'Couple', 'Mountain'], imageUrl: 'https://loremflickr.com/800/600/munnar,tea,hills/all' },
  { name: 'Kochi', country: 'India', description: 'A vibrant city with Chinese fishing nets, spice markets, and art.', tags: ['Tropical', 'Balanced', 'Culture', 'Medium', 'Friends', 'City'], imageUrl: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1000&auto=format&fit=crop' }, 
  { name: 'Hyderabad', country: 'India', description: 'The City of Pearls, famous for Charminar and rich Biryani.', tags: ['Moderate', 'Intense', 'Food', 'Medium', 'Family', 'City'], imageUrl: 'https://loremflickr.com/800/600/hyderabad,charminar/all' },
  { name: 'Chennai', country: 'India', description: 'Gateway to South India, known for Marina Beach and classical music.', tags: ['Tropical', 'Intense', 'Culture', 'Medium', 'Family', 'City'], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Kolkata', country: 'India', description: 'The cultural capital of India, famous for its colonial architecture and sweets.', tags: ['Tropical', 'Intense', 'Food', 'Low', 'Friends', 'City'], imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Pune', country: 'India', description: 'A vibrant hub of education, culture, and young energy.', tags: ['Moderate', 'Balanced', 'Culture', 'Medium', 'Friends', 'City'], imageUrl: 'https://loremflickr.com/800/600/pune,shaniwar/all' },
  { name: 'Ahmedabad', country: 'India', description: 'A city of rich textiles, Gandhi Ashram, and festive spirit.', tags: ['Moderate', 'Balanced', 'Culture', 'Medium', 'Family', 'City'], imageUrl: 'https://loremflickr.com/800/600/ahmedabad,gandhi/all' }
];

const seedAgencies = [
  {
    name: 'Wanderlust India Tours',
    contactPhone: '+91 98765 43210',
    contactEmail: 'hello@wanderlustindia.com',
    instagramHandle: '@wanderlust_india',
    maxBudget: 50000,
    rating: 4.8,
    reviews: ['"Amazing experience! They organized our Goa trip flawlessly." - Rahul S.', '"Very professional and caring guides." - Priya M.'],
    servicesOffered: ['Hotels', 'Transportation', 'Activities'],
    packages: [
      { title: 'Goa Weekend Getaway', description: '3 Days / 2 Nights inclusive of 4-star hotel and breakfast.', price: 15000 },
      { title: 'Andaman Scuba Special', description: '5 Days package with certified scuba diving courses included.', price: 45000 }
    ]
  },
  {
    name: 'Himalayan Adventures',
    contactPhone: '+91 91234 56789',
    contactEmail: 'treks@himalayanadventures.in',
    instagramHandle: '@himalayan_adv',
    maxBudget: 25000,
    rating: 4.9,
    reviews: ['"Best trekking guides ever in Manali." - Arjun K.', '"Made our Rishikesh rafting super safe and fun!" - Neha D.'],
    servicesOffered: ['Activities', 'Transportation'],
    packages: [
      { title: 'Manali Snow Trek', description: '4 Days guided trek in the snow with camping gear provided.', price: 12000 },
      { title: 'Rishikesh Thrill Seekers', description: '2 Days river rafting, bungee jumping and camping.', price: 8000 }
    ]
  },
  {
    name: 'Royal Heritage Travels',
    contactPhone: '+91 88888 11111',
    contactEmail: 'booking@royalheritage.in',
    instagramHandle: '@royal_heritage_tours',
    maxBudget: 150000,
    rating: 4.7,
    reviews: ['"Felt like royalty in Udaipur. Incredible palace stays!" - Vikram & Anjali', '"Great historical insights in Jaipur." - Sanjeev R.'],
    servicesOffered: ['Hotels', 'Food', 'Transportation'],
    packages: [
      { title: 'Udaipur Palace Experience', description: 'Stay in a luxury heritage palace for 3 nights with royal dining.', price: 75000 },
      { title: 'Golden Triangle Tour', description: '7 Days covering Delhi, Agra, and Jaipur in luxury transport.', price: 120000 }
    ]
  },
  {
    name: 'Spice Route Escapes',
    contactPhone: '+91 77777 22222',
    contactEmail: 'hello@spiceroute.com',
    instagramHandle: '@spice_route_kerala',
    maxBudget: 80000,
    rating: 4.9,
    reviews: ['"The Kerala houseboat they booked was magical." - Sofia', '"Perfect honeymoon package in Munnar." - David H.'],
    servicesOffered: ['Hotels', 'Food', 'Activities'],
    packages: [
      { title: 'Kerala Houseboat Retreat', description: '2 Nights exclusive houseboat stay with authentic meals.', price: 25000 },
      { title: 'Munnar Tea Estates Tour', description: '4 Days in Munnar with tea tasting and nature walks.', price: 35000 }
    ]
  },
  {
    name: 'Cityscapes & Foodies',
    contactPhone: '+91 66666 33333',
    contactEmail: 'tours@cityscapes.in',
    instagramHandle: '@cityfoodies_india',
    maxBudget: 30000,
    rating: 4.5,
    reviews: ['"The Delhi food tour was mind-blowing!" - Ananya', '"Great weekend itinerary for Mumbai." - Kabir'],
    servicesOffered: ['Food', 'Transportation'],
    packages: [
      { title: 'Old Delhi Food Walk', description: 'Full day culinary adventure through the streets of Chandni Chowk.', price: 3000 },
      { title: 'Mumbai Bollywood Tour', description: '2 Days covering famous film sets, Juhu beach, and Marine Drive.', price: 15000 }
    ]
  },
  {
    name: 'Sacred Journeys',
    contactPhone: '+91 55555 44444',
    contactEmail: 'peace@sacredjourneys.in',
    instagramHandle: '@sacred_journeys',
    maxBudget: 20000,
    rating: 4.6,
    reviews: ['"Varanasi tour was deeply spiritual and well organized." - Dr. Singh', '"Smooth transport in Amritsar." - Harpreet'],
    servicesOffered: ['Hotels', 'Transportation'],
    packages: [
      { title: 'Varanasi Ganga Aarti', description: '2 Days stay near the Ghats with boat rides and guided temple tours.', price: 8000 },
      { title: 'Amritsar Golden Temple Package', description: '3 Days package with Wagah Border visit.', price: 11000 }
    ]
  },
  {
    name: 'Tropical Bliss Packages',
    contactPhone: '+91 44444 55555',
    contactEmail: 'sun@tropicalbliss.in',
    instagramHandle: '@tropicalbliss',
    maxBudget: 100000,
    rating: 4.8,
    reviews: ['"Andaman islands trip was perfectly curated, diving was amazing." - Riya T.', '"Great resorts in Goa!" - Varun'],
    servicesOffered: ['Hotels', 'Food', 'Transportation', 'Activities'],
    packages: [
      { title: 'Goa Resort Escape', description: '4 Days in a premium beachside resort with spa access.', price: 40000 },
      { title: 'Andaman Luxury Cruise', description: '6 Days covering Havelock and Neil islands by private cruise.', price: 85000 }
    ]
  },
  {
    name: 'Backpackers India',
    contactPhone: '+91 33333 66666',
    contactEmail: 'go@backpackers.in',
    instagramHandle: '@backpackers_ind',
    maxBudget: 15000,
    rating: 4.3,
    reviews: ['"Cheap, reliable, and met great people on the bus tours!" - Sam', '"Perfect for students travelling to Pune/Bangalore." - Aisha'],
    servicesOffered: ['Transportation', 'Activities'],
    packages: [
      { title: 'Pune Student Getaway', description: 'Budget hostels and local transport passes for 3 days.', price: 4000 },
      { title: 'Manali Group Backpacking', description: '5 Days group tour with shared dorms and bus travel.', price: 9000 }
    ]
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB...');

    await Place.deleteMany({});
    await Agency.deleteMany({});
    console.log('Cleared existing collections.');

    const createdPlaces = await Place.insertMany(seedPlaces);
    console.log(`Inserted ${createdPlaces.length} places.`);

    // Attach ALL places to ALL agencies to ensure dense data (6-7+ agencies per place)
    const allPlaceIds = createdPlaces.map(p => p._id);
    for (let i = 0; i < seedAgencies.length; i++) {
      seedAgencies[i].servingPlaces = allPlaceIds;
    }

    const createdAgencies = await Agency.insertMany(seedAgencies);
    console.log(`Inserted ${createdAgencies.length} agencies.`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
}

seedDB();
