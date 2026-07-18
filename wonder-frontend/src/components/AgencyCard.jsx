import { useState, useEffect } from 'react';
import { Star, Phone, Mail, AtSign, DollarSign, ChevronDown, ChevronUp, Heart, Bed, Utensils, Car, Ticket } from 'lucide-react';
import './AgencyCard.css';

const AgencyCard = ({ agency }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSaved = () => {
      const saved = JSON.parse(localStorage.getItem('dreamItinerary_agencies') || '[]');
      setIsSaved(!!saved.find(item => item._id === agency._id));
    };
    checkSaved();
    window.addEventListener('itineraryUpdated', checkSaved);
    return () => window.removeEventListener('itineraryUpdated', checkSaved);
  }, [agency._id]);

  const toggleSaved = (e) => {
    e.stopPropagation();
    let saved = JSON.parse(localStorage.getItem('dreamItinerary_agencies') || '[]');
    const exists = saved.find(item => item._id === agency._id);
    
    if (exists) {
      saved = saved.filter(item => item._id !== agency._id);
    } else {
      saved.push({ _id: agency._id, name: agency.name, type: 'agency' });
    }
    
    localStorage.setItem('dreamItinerary_agencies', JSON.stringify(saved));
    setIsSaved(!exists);
    window.dispatchEvent(new Event('itineraryUpdated'));
  };

  const getServiceIcon = (service) => {
    switch(service) {
      case 'Hotels': return <Bed size={14} />;
      case 'Food': return <Utensils size={14} />;
      case 'Transportation': return <Car size={14} />;
      case 'Activities': return <Ticket size={14} />;
      default: return null;
    }
  };

  return (
    <div className="agency-card glass-panel">
      <div className="agency-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>{agency.name}</h3>
          <button className="heart-btn-agency" onClick={toggleSaved}>
            <Heart fill={isSaved ? "var(--accent-color)" : "none"} color={isSaved ? "var(--accent-color)" : "var(--primary-color)"} size={20} />
          </button>
        </div>
        <div className="agency-rating">
          <Star size={16} fill="var(--accent-color)" color="var(--accent-color)" />
          <span>{agency.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="agency-details">
        <div className="detail-item">
          <DollarSign size={16} className="detail-icon" />
          <span>Max Budget: ₹{agency.maxBudget.toLocaleString()}</span>
        </div>
        <div className="contact-links">
          <a href={`tel:${agency.contactPhone}`} className="contact-btn">
            <Phone size={18} />
          </a>
          <a href={`mailto:${agency.contactEmail}`} className="contact-btn">
            <Mail size={18} />
          </a>
          {agency.instagramHandle && (
            <a href={`https://instagram.com/${agency.instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-btn">
              <AtSign size={18} />
            </a>
          )}
        </div>
      </div>
      
      {agency.servicesOffered && agency.servicesOffered.length > 0 && (
        <div className="agency-services" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0 1.5rem', marginBottom: '1rem' }}>
          {agency.servicesOffered.map((service, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', backgroundColor: 'rgba(0, 0, 0, 0.05)', padding: '4px 8px', borderRadius: '12px', color: 'var(--text-dark)', fontWeight: '500' }}>
              {getServiceIcon(service)}
              {service}
            </span>
          ))}
        </div>
      )}
      
      {agency.reviews && agency.reviews.length > 0 && (
        <div className="agency-review">
          <p>{agency.reviews[0]}</p>
        </div>
      )}

      {agency.packages && agency.packages.length > 0 && (
        <div className="packages-section">
          <button className="toggle-packages-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Hide Packages' : 'View Packages'}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isExpanded && (
            <div className="packages-list">
              {agency.packages.map((pkg, idx) => (
                <div key={idx} className="package-item">
                  <div className="package-header">
                    <h4>{pkg.title}</h4>
                    <span className="package-price">₹{pkg.price.toLocaleString()}</span>
                  </div>
                  <p className="package-desc">{pkg.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyCard;
