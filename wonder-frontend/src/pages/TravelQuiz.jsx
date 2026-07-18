import { useState, useEffect } from 'react';
import PlaceCard from '../components/PlaceCard';
import './Quiz.css';

const questions = [
  {
    id: 1,
    text: "What's your preferred climate?",
    options: ["Tropical", "Cool", "Moderate"]
  },
  {
    id: 2,
    text: "What vibe are you looking for?",
    options: ["Relaxing", "Intense", "Balanced"]
  },
  {
    id: 3,
    text: "What is your core activity focus?",
    options: ["Nature", "History", "Thrill", "Culture", "Beach"]
  },
  {
    id: 4,
    text: "What's your budget tier?",
    options: ["Low", "Medium", "High"]
  },
  {
    id: 5,
    text: "Who are you traveling with?",
    options: ["Solo", "Couple", "Family", "Friends"]
  }
];

const AnimatedMeter = ({ score, label }) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = score / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, intervalTime);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="match-meter-container">
      <h4>{label}</h4>
      <div className="match-meter">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r={radius} stroke="rgba(0,0,0,0.1)" strokeWidth="8" fill="none" />
          <circle 
            cx="60" cy="60" r={radius} 
            stroke="var(--accent-color)" 
            strokeWidth="8" 
            fill="none" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="meter-text">{currentScore}%</div>
      </div>
    </div>
  );
};

const TravelQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [places, setPlaces] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Fetch all places to use for matching
    fetch('https://wonder-server.onrender.com/api/places')
      .then(res => res.json())
      .then(data => setPlaces(data))
      .catch(err => console.error(err));
  }, []);

  const handleOptionClick = (option) => {
    const newAnswers = { ...answers, [currentStep]: option };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateMatches(newAnswers);
    }
  };

  const calculateMatches = (finalAnswers) => {
    // Collect selected tags
    const selectedTags = Object.values(finalAnswers);

    const scoredPlaces = places.map(place => {
      let matchCount = 0;
      selectedTags.forEach(tag => {
        if (place.tags.includes(tag)) {
          matchCount++;
        }
      });
      // Percentage based on total questions
      const score = Math.round((matchCount / questions.length) * 100);
      return { ...place, matchScore: score };
    });

    // Sort by score descending and take top 3
    scoredPlaces.sort((a, b) => b.matchScore - a.matchScore);
    setResults(scoredPlaces.slice(0, 3));
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  };

  if (results) {
    return (
      <div className="quiz-results">
        <h2>Your Perfect Destinations</h2>
        <p>Based on your answers, here are our top recommendations:</p>
        <div className="places-grid match-results-grid">
          {results.map((place, idx) => (
            <div key={place._id} className="result-item">
              <AnimatedMeter score={place.matchScore} label={idx === 0 ? "Top Match!" : "Great Match"} />
              <PlaceCard place={place} />
            </div>
          ))}
        </div>
        <button className="btn btn-secondary mt-2" onClick={resetQuiz}>Take Quiz Again</button>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="quiz-container">
      <div className="quiz-card glass-panel">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="quiz-header">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <h2>{question.text}</h2>
        </div>
        
        <div className="options-grid">
          {question.options.map((option, idx) => (
            <button 
              key={idx} 
              className="option-btn"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelQuiz;
