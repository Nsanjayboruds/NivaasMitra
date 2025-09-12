import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { properties as fullProperties } from "../data/properties";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🏠 Welcome to MakaanWala! I'm your AI property assistant. How can I help you find your dream property today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Derived property dataset from central properties.js
  const propertyDatabase = fullProperties.map((p) => ({
    id: p.id,
    type: p.type?.toLowerCase(),
    title: p.title,
    price: p.price,
    location: (p.location || "").split(",")[0],
    features: p.features || [],
    description: p.description || "",
  }));

  const priceToLakhs = (priceStr) => {
    if (!priceStr) return null;
    const raw = priceStr
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .trim()
      .toLowerCase();
    const m = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*(cr|crore|l|lakh)?/i);
    if (!m) return null;
    const amt = parseFloat(m[1]);
    const unit = (m[2] || "lakh").toLowerCase();
    if (unit.startsWith("cr") || unit.startsWith("crore")) return amt * 100; // crore to lakh
    return amt; // lakh
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Budget extraction (supports decimal + crore/lakh shorthand)
    let userBudget = null; // in lakhs
    const budgetMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*(cr|crore|lakh|l)?/i);
    if (budgetMatch) {
      const amount = parseFloat(budgetMatch[1]);
      const unit = (budgetMatch[2] || "lakh").toLowerCase();
      userBudget = unit.startsWith("cr") ? amount * 100 : amount;
    }

    if (lowerMessage.includes("apartment") || lowerMessage.includes("flat")) {
      const apartment = propertyDatabase.find((p) => p.type === "apartment");
      if (apartment)
        return `Featured apartment: ${apartment.title} (${apartment.location}) at ${apartment.price}. Key: ${apartment.features.slice(
          0,
          4
        ).join(", ")}. Want more details?`;
    }

    if (lowerMessage.includes("villa") || lowerMessage.includes("house")) {
      const villa = propertyDatabase.find((p) => p.type === "villa");
      if (villa)
        return `Luxury villa option: ${villa.title} in ${villa.location} at ${villa.price}. Highlights: ${villa.features.slice(
          0,
          4
        ).join(", ")}. Schedule a viewing?`;
    }

    if (lowerMessage.includes("studio")) {
      const studio = propertyDatabase.find((p) => /studio/i.test(p.title));
      if (studio)
        return `Studio match: ${studio.title} in ${studio.location} at ${studio.price}. Features: ${studio.features.slice(
          0,
          4
        ).join(", ")}.`;
    }

    if (lowerMessage.includes("commercial") || lowerMessage.includes("office")) {
      const commercial = propertyDatabase.find((p) => p.type === "commercial");
      if (commercial)
        return `Commercial highlight: ${commercial.title} (${commercial.location}) at ${commercial.price}. Core: ${commercial.features.slice(
          0,
          4
        ).join(", ")}.`;
    }

    if (
      lowerMessage.includes("budget") ||
      lowerMessage.includes("price") ||
      lowerMessage.includes("under")
    ) {
      if (userBudget) {
        const matches = propertyDatabase
          .map((p) => ({ p, priceL: priceToLakhs(p.price) }))
          .filter((obj) => obj.priceL && obj.priceL <= userBudget * 1.05)
          .sort((a, b) => a.priceL - b.priceL)
          .slice(0, 3);
        if (matches.length) {
          const list = matches
            .map((m) => `${m.p.title} (${m.p.price})`)
            .join(" | ");
          return `Options near ₹${userBudget}L: ${list}. Which one interests you?`;
        }
        return `No listings below ~₹${userBudget}L found. Try increasing budget or specify location.`;
      }
      const lakhValues = propertyDatabase
        .map((p) => priceToLakhs(p.price))
        .filter(Boolean);
      if (lakhValues.length) {
        const min = Math.min(...lakhValues);
        const max = Math.max(...lakhValues);
        return `Current range: ~₹${Math.round(min)}L to ₹${(
          max / 100
        ).toFixed(2)}Cr. Share your budget (e.g. 45 lakh, 1.2 cr).`;
      }
      return "Share your budget (e.g. 45 lakh, 1 cr) and I'll suggest matches.";
    }

    if (/(loan|financ|emi)/.test(lowerMessage)) {
      return "💰 Partner banks: SBI, HDFC, ICICI, Axis. Rates from ~8.5% with up to 90% LTV. Want EMI guidance?";
    }

    if (/(viewing|visit|schedule)/.test(lowerMessage)) {
      return "🏠 Viewing options: today, weekend, or virtual. Provide property type or location to proceed.";
    }

    if (/delhi/.test(lowerMessage)) {
      const delhi = propertyDatabase.find((p) => /delhi/i.test(p.location));
      if (delhi)
        return `Delhi sample: ${delhi.title} at ${delhi.price}. Preferred area (Central/South/West)?`;
    }

    if (/(gurgaon|gurugram)/.test(lowerMessage)) {
      const gurgaon = propertyDatabase.filter((p) => /gurgaon/i.test(p.location));
      if (gurgaon.length)
        return `Gurgaon listings: ${gurgaon.length}. Example: ${gurgaon[0].title} (${gurgaon[0].price}). Residential or commercial?`;
    }

    if (/(bangalore|bengaluru)/.test(lowerMessage)) {
      const blr = propertyDatabase.find((p) => /(bangalore|bengaluru)/i.test(p.location));
      if (blr)
        return `Bangalore example: ${blr.title} at ${blr.price}. Focus on Koramangala, Whitefield, or another area?`;
    }

    if (/(hello|hi|hey)/.test(lowerMessage)) {
      return "Hello! 👋 I can help with apartments, villas, commercial spaces, budgets, and viewings. What are you looking for?";
    }

    if (/thank/.test(lowerMessage)) {
      return "You're welcome! Need anything else—budget suggestions, locations, or loan info?";
    }

    return "Tell me what you're seeking (e.g. '3 BHK in Delhi under 80 lakh' or 'commercial space in Gurgaon') and I'll shortlist options.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageToProcess = inputValue;
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(messageToProcess),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Show me apartments",
    "Find luxury villas",
    "Properties under ₹50L",
    "Schedule viewing",
    "Loan assistance",
    "Properties in Delhi",
  ];

  return (
    <div className={`chatbot ${isOpen ? "chatbot-open" : ""}`}>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <h4>🏠 MakaanWala AI Assistant</h4>
              <span className="online-indicator">● Online - Instant Help</span>
            </div>
            <button
              className="clear-chat-btn"
              onClick={() =>
                setMessages([
                  {
                    id: 1,
                    text: "🏠 Welcome back! I'm your AI property assistant. How can I help you today?",
                    isUser: false,
                    timestamp: new Date(),
                  },
                ])
              }
              title="Clear Chat"
            >
              🔄
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.isUser ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(handleSendMessage, 100);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about properties, prices, locations..."
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
