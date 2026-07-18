import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle } from 'lucide-react';
import './Register.css';

const RegisterAgency = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactPhone: '',
    contactEmail: '',
    instagramHandle: '',
    maxBudget: 50000,
    servingPlaces: [],
    servicesOffered: [],
    packages: []
  });
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('https://wonder-server.onrender.com/api/places')
      .then(res => res.json())
      .then(data => setAvailablePlaces(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceToggle = (placeId) => {
    setFormData(prev => {
      const isSelected = prev.servingPlaces.includes(placeId);
      if (isSelected) {
        return { ...prev, servingPlaces: prev.servingPlaces.filter(id => id !== placeId) };
      } else {
        return { ...prev, servingPlaces: [...prev.servingPlaces, placeId] };
      }
    });
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const isSelected = prev.servicesOffered.includes(service);
      if (isSelected) {
        return { ...prev, servicesOffered: prev.servicesOffered.filter(s => s !== service) };
      } else {
        return { ...prev, servicesOffered: [...prev.servicesOffered, service] };
      }
    });
  };

  const handleAddPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { title: '', description: '', price: 0 }]
    }));
  };

  const handlePackageChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[index] = { ...newPackages[index], [name]: value };
      return { ...prev, packages: newPackages };
    });
  };

  const handleRemovePackage = (index) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages.splice(index, 1);
      return { ...prev, packages: newPackages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://wonder-server.onrender.com/api/agencies/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/search');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="register-success">
        <CheckCircle size={64} color="var(--secondary-color)" />
        <h2>Registration Successful!</h2>
        <p>Welcome to Travel DE. You will be redirected shortly.</p>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card glass-panel">
        <div className="register-header">
          <Briefcase size={32} className="header-icon" />
          <h2>Partner with Us</h2>
          <p>Register your travel agency and reach thousands of explorers.</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Agency Name *</label>
            <input 
              type="text" 
              name="name" 
              className="input-field" 
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wanderlust Tours"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Phone *</label>
              <input 
                type="tel" 
                name="contactPhone" 
                className="input-field" 
                required
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label>Contact Email *</label>
              <input 
                type="email" 
                name="contactEmail" 
                className="input-field" 
                required
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="hello@agency.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Instagram Handle</label>
              <input 
                type="text" 
                name="instagramHandle" 
                className="input-field" 
                value={formData.instagramHandle}
                onChange={handleChange}
                placeholder="@youragency"
              />
            </div>
            <div className="form-group">
              <label>Max Budget Cap (₹) *</label>
              <input 
                type="number" 
                name="maxBudget" 
                className="input-field" 
                required
                min="1000"
                value={formData.maxBudget}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Destinations Serviced *</label>
            <div className="places-selector">
              {availablePlaces.map(place => (
                <div 
                  key={place._id} 
                  className={`place-pill ${formData.servingPlaces.includes(place._id) ? 'selected' : ''}`}
                  onClick={() => handlePlaceToggle(place._id)}
                >
                  {place.name}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Services Offered</label>
            <div className="places-selector">
              {['Hotels', 'Food', 'Transportation', 'Activities'].map(service => (
                <div 
                  key={service} 
                  className={`place-pill ${formData.servicesOffered.includes(service) ? 'selected' : ''}`}
                  onClick={() => handleServiceToggle(service)}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group packages-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ marginBottom: 0 }}>Agency Packages</label>
              <button type="button" onClick={handleAddPackage} className="btn" style={{ padding: '4px 12px', fontSize: '0.9rem', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                + Add Package
              </button>
            </div>
            
            {formData.packages.map((pkg, idx) => (
              <div key={idx} className="package-form-card" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>Package {idx + 1}</span>
                  <button type="button" onClick={() => handleRemovePackage(idx)} style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" className="input-field" value={pkg.title} onChange={(e) => handlePackageChange(idx, e)} placeholder="e.g. 3 Days Hotel + Transport" required />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" className="input-field" value={pkg.price} onChange={(e) => handlePackageChange(idx, e)} required min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" className="input-field" value={pkg.description} onChange={(e) => handlePackageChange(idx, e)} required style={{ minHeight: '60px', resize: 'vertical' }}></textarea>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={loading || formData.servingPlaces.length === 0}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAgency;
