import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSaved = () => {
      const saved = JSON.parse(localStorage.getItem('dreamItinerary_places') || '[]');
      setIsSaved(!!saved.find(item => item._id === place._id));
    };
    checkSaved();
    window.addEventListener('itineraryUpdated', checkSaved);
    return () => window.removeEventListener('itineraryUpdated', checkSaved);
  }, [place._id]);

  const toggleSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let saved = JSON.parse(localStorage.getItem('dreamItinerary_places') || '[]');
    const exists = saved.find(item => item._id === place._id);

    if (exists) {
      saved = saved.filter(item => item._id !== place._id);
    } else {
      saved.push({ _id: place._id, name: place.name, type: 'place', imageUrl: place.imageUrl });
    }

    localStorage.setItem('dreamItinerary_places', JSON.stringify(saved));
    setIsSaved(!exists);
    window.dispatchEvent(new Event('itineraryUpdated'));
  };

  return (
    <Link to={`/place/${place._id}`} state={{ place }} className="place-card glass-panel">
      <div className="place-image-container">
        <img src={place.imageUrl} alt={place.name} className="place-image" />
        <button className="heart-btn" onClick={toggleSaved}>
          <Heart fill={isSaved ? "var(--accent-color)" : "rgba(0,0,0,0.5)"} color={isSaved ? "var(--accent-color)" : "white"} size={22} />
        </button>
      </div>
      <div className="place-content">
        <div className="place-header">
          <h3>{place.name}</h3>
          <span className="place-country"><MapPin size={14} /> {place.country}</span>
        </div>
        <p className="place-desc">{place.description}</p>
        <div className="place-tags">
          {place.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};
export default PlaceCard;
