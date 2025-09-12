"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = ({ onExplore }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    properties: 0,
    clients: 0,
    agents: 0,
    experience: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchSuggestions] = useState([
    "Mumbai Properties",
    "Delhi NCR Apartments",
    "Bangalore IT Hub Flats",
    "Pune 2BHK Under 50L",
    "Chennai Beach View",
    "Hyderabad Gated Community",
    "Kolkata Heritage Homes",
    "Ahmedabad Commercial",
  ]);

  const filteredSuggestions = searchSuggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase()) &&
        searchQuery.length > 0
    )
    .slice(0, 5);

  useEffect(() => {
    // Animate counters on load
    const targets = {
      properties: 5000,
      clients: 10000,
      agents: 200,
      experience: 20,
    };

    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;

    Object.keys(targets).forEach((key) => {
      const target = targets[key];
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, stepDuration);
    });
  }, []);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSearchFocus(false);
    handleSearch(suggestion);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🏆</span>
              <span>India&apos;s Leading Real Estate Platform</span>
            </div>

            <h1 className="hero-title">Find Your Perfect Property in India</h1>

            <p className="hero-subtitle">
              Professional real estate services with over 20 years of
              experience. We help you buy, sell, and invest in properties across
              major Indian cities with confidence and expertise.
            </p>

            <div className="hero-search">
              <div
                className={`search-container ${
                  searchFocus ? "search-focus" : ""
                }`}
              >
                <div className="search-icon-left">
                  <span>📍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by location, property type, or budget..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
                  onKeyPress={handleKeyPress}
                  aria-label="Search properties"
                  aria-expanded={searchFocus && filteredSuggestions.length > 0}
                  aria-haspopup="listbox"
                  role="combobox"
                />
                {/* Removed type filter dropdown as requested */}
                <button
                  className="search-button"
                  onClick={() => handleSearch()}
                  aria-label="Search properties"
                  type="button"
                >
                  <span>🔍</span>
                  <span className="search-text">Search</span>
                </button>
              </div>

              {searchFocus && filteredSuggestions.length > 0 && (
                <div className="search-suggestions" role="listbox">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                      role="option"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSuggestionClick(suggestion);
                        }
                      }}
                    >
                      <span className="suggestion-icon">📍</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={onExplore}>
                <span>Browse Properties</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    // Fallback: navigate to root with hash if routing retains component
                    window.location.hash = "contact";
                  }
                }}
                aria-label="Scroll to contact section to schedule a consultation"
              >
                <span>Schedule Consultation</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image">
              <img
                src="/professional_real_estate.jpg?height=400&width=600&text=Professional+Real+Estate+Services"
                alt="Professional Real Estate Services"
              />
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-number">
              {stats.properties.toLocaleString()}+
            </div>
            <div className="stat-label">Properties Sold</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.clients.toLocaleString()}+</div>
            <div className="stat-label">Satisfied Clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-number">{stats.agents}+</div>
            <div className="stat-label">Expert Agents</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.experience}+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
