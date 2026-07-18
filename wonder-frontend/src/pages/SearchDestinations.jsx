import { useState, useEffect } from 'react';
import { Search as SearchIcon, MapPin, Building } from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import AgencyCard from '../components/AgencyCard';
import './Search.css';

const SearchDestinations = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('places');

  useEffect(() => {
    fetchResults();
  }, [searchMode]);

  const fetchResults = async (searchQuery = '') => {
    setLoading(true);
    try {
      const endpoint = searchMode === 'places' ? 'places' : 'agencies';
      const url = searchQuery 
        ? `https://wonder-server.onrender.com/api/${endpoint}?query=${encodeURIComponent(searchQuery)}`
        : `https://wonder-server.onrender.com/api/${endpoint}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(`Error fetching ${searchMode}:`, err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(query);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Find Your {searchMode === 'places' ? 'Destination' : 'Agency'}</h1>
        
        <div className="search-toggle-container">
          <div className="search-toggle">
            <button 
              className={searchMode === 'places' ? 'active' : ''} 
              onClick={() => { setSearchMode('places'); setQuery(''); }}
              type="button"
            >
              <MapPin size={18} /> Places
            </button>
            <button 
              className={searchMode === 'agencies' ? 'active' : ''} 
              onClick={() => { setSearchMode('agencies'); setQuery(''); }}
              type="button"
            >
              <Building size={18} /> Agencies
            </button>
          </div>
        </div>

        <form className="search-bar glass-panel" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder={searchMode === 'places' ? "Search by name, country, or tags (e.g. Beach, Relaxing)..." : "Search by agency name or services (e.g. Hotels, Transport)..."} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary search-btn">
            <SearchIcon size={20} />
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading {searchMode}...</div>
      ) : (
        <div className={searchMode === 'places' ? "places-grid" : "agencies-grid"}>
          {results.length > 0 ? (
            results.map(item => (
              searchMode === 'places' 
                ? <PlaceCard key={item._id} place={item} />
                : <AgencyCard key={item._id} agency={item} />
            ))
          ) : (
            <div className="no-results">No {searchMode} found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDestinations;
