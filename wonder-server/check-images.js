const fs = require('fs');
const https = require('https');

const seedPlaces = [
  { name: 'Goa Beaches', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Kerala Backwaters', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Jaipur (Pink City)', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Manali', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Varanasi', url: 'https://images.unsplash.com/photo-1571536802807-3cab46e14af5?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Andaman Islands', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Rishikesh', url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Mumbai', url: 'https://images.unsplash.com/photo-1522256794503-455b6c0e5a87?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Delhi', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Bangalore', url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Udaipur', url: 'https://images.unsplash.com/photo-1615861430489-0d32bbab88f4?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Agra', url: 'https://images.unsplash.com/photo-1564507592208-027efa82f5b8?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Darjeeling', url: 'https://images.unsplash.com/photo-1544634076-a90160ddf44a?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Amritsar', url: 'https://images.unsplash.com/photo-1587570417730-a199d750c822?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Mysore', url: 'https://images.unsplash.com/photo-1600100397608-f010f419c91b?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Shimla', url: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Ooty', url: 'https://images.unsplash.com/photo-1580982559530-58c9735d4812?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Munnar', url: 'https://images.unsplash.com/photo-1593693397690-362cb9666c59?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Kochi', url: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Hyderabad', url: 'https://images.unsplash.com/photo-1623192080351-4e7cb8a99478?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Chennai', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Kolkata', url: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Pune', url: 'https://images.unsplash.com/photo-1559828479-51a44e69b2d8?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Ahmedabad', url: 'https://images.unsplash.com/photo-1601058343753-485a0c8c07e0?q=80&w=1000&auto=format&fit=crop' }
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
}

async function run() {
  for (const place of seedPlaces) {
    const status = await checkUrl(place.url);
    console.log(`${place.name}: ${status}`);
  }
}
run();
