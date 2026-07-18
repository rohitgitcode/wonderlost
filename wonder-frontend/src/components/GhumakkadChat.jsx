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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

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
      setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! My backpack is too heavy right now. Try again later!' }]);
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
