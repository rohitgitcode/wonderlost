import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MapPin, SlidersHorizontal } from 'lucide-react';
import AgencyCard from '../components/AgencyCard';
import './PlaceAgencies.css';

const PlaceAgencies = () => {
  const { id } = useParams();
  const location = useLocation();
  
  const [place, setPlace] = useState(location.state?.place || null);
  const [agencies, setAgencies] = useState([]);
  const [maxBudget, setMaxBudget] = useState(100000);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
    
    // Feature 2: Dynamic Atmospheric Theme Shifts
    if (place && place.tags) {
      let themeClass = '';
      const tagsString = place.tags.join(' ').toLowerCase();
      
      if (tagsString.includes('beach') || tagsString.includes('tropical')) {
        themeClass = 'theme-beach';
      } else if (tagsString.includes('mountain') || tagsString.includes('cool') || tagsString.includes('nature')) {
        themeClass = 'theme-mountain';
      } else if (tagsString.includes('city') || tagsString.includes('history')) {
        themeClass = 'theme-city';
      }
      
      if (themeClass) {
        document.body.classList.add(themeClass);
      }
      
      return () => {
        if (themeClass) document.body.classList.remove(themeClass);
      };
    }
  }, [id, maxBudget, place, selectedServices]);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      let url = `https://wonder-server.onrender.com/api/agencies?placeId=${id}&maxBudget=${maxBudget}`;
      if (selectedServices.length > 0) {
        url += `&services=${selectedServices.join(',')}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setAgencies(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleServiceFilterToggle = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="place-agencies-page">
      {place && (
        <div className="destination-header glass-panel" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 4, 40, 0.7), rgba(0, 78, 146, 0.7)), url(${place.imageUrl})` }}>
          <h1>{place.name}</h1>
          <p><MapPin size={18} /> {place.country}</p>
          <div className="header-tags">
            {place.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
          </div>
        </div>
      )}

      <div className="agencies-content">
        <div className="filter-sidebar glass-panel">
          <div className="filter-header">
            <SlidersHorizontal size={20} />
            <h3>Filters</h3>
          </div>
          <div className="filter-group">
            <label>Max Budget: ₹{maxBudget.toLocaleString()}</label>
            <input 
              type="range" 
              min="5000" 
              max="200000" 
              step="5000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="budget-slider"
            />
          </div>
          <div className="filter-group" style={{ marginTop: '1.5rem' }}>
            <label>Services</label>
            <div className="services-filter" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Hotels', 'Food', 'Transportation', 'Activities'].map(service => (
                <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-dark)' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceFilterToggle(service)}
                    style={{ accentColor: 'var(--accent-color)' }}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="agencies-list">
          <h2>Available Agencies</h2>
          {loading ? (
            <p>Loading agencies...</p>
          ) : agencies.length > 0 ? (
            <div className="agencies-grid">
              {agencies.map(agency => (
                <AgencyCard key={agency._id} agency={agency} />
              ))}
            </div>
          ) : (
            <div className="glass-panel empty-state">
              <p>No agencies found matching your criteria for this destination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceAgencies;
