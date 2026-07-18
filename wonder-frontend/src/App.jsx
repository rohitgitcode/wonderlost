import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchDestinations from './pages/SearchDestinations';
import TravelQuiz from './pages/TravelQuiz';
import PlaceAgencies from './pages/PlaceAgencies';
import RegisterAgency from './pages/RegisterAgency';
import GhumakkadChat from './components/GhumakkadChat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="fomo-ticker-container">
        <div className="fomo-ticker-text">
          <span>🔥 Express Travels just added a new budget package for Manali under ₹5,000!</span>
          <span>✨ 42 travelers matched with Kerala in the last hour!</span>
          <span>🌟 Flash Sale: 20% off on all Goa bookings today only!</span>
        </div>
      </div>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchDestinations />} />
          <Route path="/quiz" element={<TravelQuiz />} />
          <Route path="/place/:id" element={<PlaceAgencies />} />
          <Route path="/register-agency" element={<RegisterAgency />} />
        </Routes>
      </main>
      <GhumakkadChat />
    </Router>
  );
}

export default App;
