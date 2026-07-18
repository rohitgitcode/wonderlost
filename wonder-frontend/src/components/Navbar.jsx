import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, UserPlus, Heart, X, Trash2 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [savedAgencies, setSavedAgencies] = useState([]);

  const loadItinerary = () => {
    setSavedPlaces(JSON.parse(localStorage.getItem('dreamItinerary_places') || '[]'));
    setSavedAgencies(JSON.parse(localStorage.getItem('dreamItinerary_agencies') || '[]'));
  };

  useEffect(() => {
    loadItinerary();
    window.addEventListener('itineraryUpdated', loadItinerary);
    return () => window.removeEventListener('itineraryUpdated', loadItinerary);
  }, []);

  const removePlace = (id) => {
    const updated = savedPlaces.filter(p => p._id !== id);
    localStorage.setItem('dreamItinerary_places', JSON.stringify(updated));
    setSavedPlaces(updated);
    window.dispatchEvent(new Event('itineraryUpdated'));
  };

  const removeAgency = (id) => {
    const updated = savedAgencies.filter(a => a._id !== id);
    localStorage.setItem('dreamItinerary_agencies', JSON.stringify(updated));
    setSavedAgencies(updated);
    window.dispatchEvent(new Event('itineraryUpdated'));
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <PlaneTakeoff size={32} className="logo-icon" />
            <span className="logo-text">Wonderlost</span>
          </Link>
          <div className="navbar-links">
            <Link to="/search" className="nav-link">Destinations</Link>
            <Link to="/quiz" className="nav-link">Travel Quiz</Link>
            <button className="nav-link icon-btn" onClick={() => setDrawerOpen(true)}>
              <Heart size={20} className="heart-nav-icon" /> Dream Itinerary
            </button>
            <Link to="/register-agency" className="nav-btn">
              <UserPlus size={18} /> Register Agency
            </Link>
          </div>
        </div>
      </nav>

      {/* Feature 3: Interactive Dream Itinerary Board */}
      <div className={`itinerary-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}></div>
      <div className={`itinerary-drawer glass-panel ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2><Heart fill="var(--accent-color)" color="var(--accent-color)" size={24} /> My Dream Itinerary</h2>
          <button className="close-drawer" onClick={() => setDrawerOpen(false)}><X size={24} /></button>
        </div>

        <div className="drawer-content">
          <h3>Saved Destinations</h3>
          {savedPlaces.length === 0 ? <p className="empty-text">No places saved yet.</p> : (
            <div className="saved-list">
              {savedPlaces.map(p => (
                <div key={p._id} className="saved-item">
                  <div className="saved-info">
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="saved-img" />}
                    <span>{p.name}</span>
                  </div>
                  <button className="remove-btn" onClick={() => removePlace(p._id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: '20px' }}>Saved Agencies</h3>
          {savedAgencies.length === 0 ? <p className="empty-text">No agencies saved yet.</p> : (
            <div className="saved-list">
              {savedAgencies.map(a => (
                <div key={a._id} className="saved-item">
                  <div className="saved-info">
                    <span className="saved-agency-name">{a.name}</span>
                  </div>
                  <button className="remove-btn" onClick={() => removeAgency(a._id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
