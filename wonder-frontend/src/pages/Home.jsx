import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Dices, X, MapPin, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinPlace, setCurrentSpinPlace] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://wonder-server.onrender.com/api/places')
      .then(res => res.json())
      .then(data => setPlaces(data))
      .catch(err => console.error(err));
  }, []);

  const handleRoulette = () => {
    if (places.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelectedPlace(null);
    
    let iterations = 0;
    const maxIterations = 25;
    
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * places.length);
      setCurrentSpinPlace(places[randomIdx]);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsSpinning(false);
        setSelectedPlace(places[randomIdx]);
      }
    }, 100);
  };
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Discover Your Next <span className="highlight">Adventure</span></h1>
        <p className="hero-subtitle">Find the perfect destination and the best travel agencies to take you there.</p>
        
        <div className="hero-actions">
          <Link to="/search" className="action-card search-card">
            <div className="icon-wrapper">
              <Search size={36} strokeWidth={2.5} />
            </div>
            <h2>Search Destinations</h2>
            <p>Browse places by name, country, or vibe.</p>
            <div className="card-arrow"><ArrowRight size={24} /></div>
          </Link>
          
          <Link to="/quiz" className="action-card quiz-card">
            <div className="icon-wrapper">
              <Sparkles size={36} strokeWidth={2.5} />
            </div>
            <h2>Take the Travel Quiz</h2>
            <p>Let our smart algorithm find your perfect match.</p>
            <div className="card-arrow"><ArrowRight size={24} /></div>
          </Link>
          
          <div className="action-card roulette-card" onClick={handleRoulette}>
            <div className="icon-wrapper">
              <Dices size={36} strokeWidth={2.5} />
            </div>
            <h2>Wanderlust Roulette</h2>
            <p>Can't decide? Let fate choose your next trip.</p>
            <div className="card-arrow"><ArrowRight size={24} /></div>
          </div>
        </div>
      </div>

      {/* Feature 1: Roulette Spin Overlay & Modal */}
      {(isSpinning || selectedPlace) && (
        <div className="roulette-overlay">
          <div className={`roulette-modal glass-panel ${selectedPlace ? 'revealed' : ''}`}>
            {isSpinning && currentSpinPlace && (
              <div className="spinning-content">
                <Dices className="spin-icon" size={48} />
                <h2 className="spin-text">{currentSpinPlace.name}</h2>
              </div>
            )}
            
            {!isSpinning && selectedPlace && (
              <div className="reveal-content">
                <button className="close-roulette" onClick={() => setSelectedPlace(null)}><X size={24} /></button>
                <div className="reveal-img-wrapper">
                  <img src={selectedPlace.imageUrl} alt={selectedPlace.name} />
                </div>
                <h2>You're going to...</h2>
                <h1 className="reveal-title">{selectedPlace.name}!</h1>
                <p><MapPin size={16}/> {selectedPlace.country}</p>
                <button className="btn btn-primary reveal-btn" onClick={() => navigate(`/place/${selectedPlace._id}`, { state: { place: selectedPlace }})}>
                  View Packages
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
