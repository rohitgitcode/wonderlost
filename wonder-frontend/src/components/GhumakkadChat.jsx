import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Backpack } from 'lucide-react';
import PlaceCard from './PlaceCard';
import AgencyCard from './AgencyCard';
import './GhumakkadChat.css';

const GhumakkadChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste! I am Ghumakkad 🎒. I can find travel destinations and agencies for you! Try asking for "beaches" or "cheap hotels".', data: null, type: 'text' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [places, setPlaces] = useState([]);

  const questions = [
    { text: "What's your preferred climate?", options: ["Tropical", "Cool", "Moderate"] },
    { text: "What vibe are you looking for?", options: ["Relaxing", "Intense", "Balanced"] },
    { text: "What is your core activity focus?", options: ["Nature", "History", "Thrill", "Culture", "Beach"] },
    { text: "What's your budget tier?", options: ["Low", "Medium", "High"] },
    { text: "Who are you traveling with?", options: ["Solo", "Couple", "Family", "Friends"] }
  ];

  const handleQuizAnswer = (option) => {
    setMessages(prev => [...prev, { sender: 'user', text: option }]);
    
    const newAnswers = { ...quizAnswers, [quizStep]: option };
    setQuizAnswers(newAnswers);

    if (quizStep < questions.length - 1) {
       const nextQ = questions[quizStep + 1];
       setMessages(prev => [...prev, { 
         sender: 'bot', 
         text: nextQ.text, 
         type: 'quiz_question', 
         options: nextQ.options 
       }]);
       setQuizStep(quizStep + 1);
    } else {
       setQuizMode(false);
       setLoading(true);
       
       const selectedTags = Object.values(newAnswers);
       const scoredPlaces = places.map(place => {
         let matchCount = 0;
         selectedTags.forEach(tag => {
           if (place.tags.includes(tag)) matchCount++;
         });
         return { ...place, matchScore: Math.round((matchCount / questions.length) * 100) };
       });

       scoredPlaces.sort((a, b) => b.matchScore - a.matchScore);
       const topMatches = scoredPlaces.slice(0, 3);
       
       setMessages(prev => [...prev, {
          sender: 'bot',
          text: "Based on your answers, here are my top recommendations for you!",
          type: 'places',
          data: topMatches
       }]);
       setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (quizMode) {
      const userText = inputText;
      setInputText('');
      handleQuizAnswer(userText);
      return;
    }

    if (inputText.match(/(suggest|recommend|find).*(place|destination)/i)) {
       setMessages(prev => [...prev, { sender: 'user', text: inputText }]);
       setMessages(prev => [...prev, { 
           sender: 'bot', 
           text: "Sure! Let's do a quick quiz to find your perfect place. " + questions[0].text,
           type: 'quiz_question',
           options: questions[0].options
       }]);
       setQuizMode(true);
       setQuizStep(0);
       setQuizAnswers({});
       setInputText('');
       
       if (places.length === 0) {
           fetch('https://wonder-server.onrender.com/api/places')
             .then(res => res.json())
             .then(data => setPlaces(data))
             .catch(console.error);
       }
       return;
    }

    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('https://wonder-server.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await response.json();

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        type: data.type,
        data: data.data || null
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'i cant answer this okyy' }]);
    }
    setLoading(false);
  };

  return (
    <div className="ghumakkad-container">
      {!isOpen && (
        <button className="ghumakkad-fab" onClick={() => setIsOpen(true)}>
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="ghumakkad-window">
          <div className="ghumakkad-header">
            <h3><Backpack size={20} /> Ghumakkad</h3>
            <button className="ghumakkad-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="ghumakkad-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'bot-wrapper'}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                  {msg.text}
                </div>
                
                {msg.type === 'quiz_question' && msg.options && (
                  <div className="quiz-options-container">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i} 
                        className="quiz-option-btn"
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={!quizMode}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Render Cards if data exists */}
                {msg.sender === 'bot' && msg.data && msg.data.length > 0 && (
                  <div className="chat-cards-container">
                    {msg.type === 'places' && msg.data.map(place => <PlaceCard key={place._id} place={place} />)}
                    {msg.type === 'agencies' && msg.data.map(agency => <AgencyCard key={agency._id} agency={agency} />)}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="message message-bot">
                <i>Thinking...</i>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ghumakkad-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask Ghumakkad..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="ghumakkad-send" disabled={loading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GhumakkadChat;
