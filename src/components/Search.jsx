
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { searchProperties } from "../data/properties"; // centralized shared data & helpers
import PropertyCard from './PropertyCard';

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const results = searchProperties(query);
    return results.filter(p => (typeFilter === 'all' ? true : p.type === typeFilter));
  }, [query, typeFilter]);

  return (
    <section className="search-results-section">
      <div className="container">
        <h2>Search Results for: <span style={{ color: '#0077cc' }}>{query}</span></h2>
        {/* Type Filter Controls */}
        {query.trim() && (
          <div style={{ marginTop: 20, marginBottom: 24, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ fontWeight: 600 }}>Filter by type:</label>
            {[
              { id: 'all', label: 'All' },
              { id: 'apartment', label: 'Apartments' },
              { id: 'villa', label: 'Villas' },
              { id: 'commercial', label: 'Commercial' },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setTypeFilter(btn.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  background: typeFilter === btn.id ? '#0077cc' : '#f5f5f5',
                  color: typeFilter === btn.id ? '#fff' : '#333',
                  fontSize: 14,
                  transition: 'all .2s'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {query.trim() && filtered.length === 0 ? (
          <div className="coming-soon-wrapper" style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 8 }}>No matches for &quot;{query}&quot;</h3>
            <p style={{ color: '#666', marginBottom: 24 }}>We&apos;re expanding our listings. This property type or location is coming soon.</p>
            <div className="properties-grid">
              <div className="property-card coming-soon-card" style={{ cursor: 'default' }}>
                <div className="property-image">
                  <img
                    src="/placeholder.svg?height=250&width=400&text=Coming+Soon"
                    alt="Coming Soon"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="property-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.55)' }}>
                    <div className="view-btn" style={{ pointerEvents: 'none' }}>Coming Soon</div>
                  </div>
                </div>
                <div className="property-info">
                  <h3 className="property-title">More Properties Coming Soon</h3>
                  <p className="property-location">New premium listings are being added.</p>
                  <div className="property-price" style={{ color: 'var(--accent-color)' }}>Stay Tuned</div>
                  <div className="property-details">
                    <span className="detail"><strong>?</strong> Beds</span>
                    <span className="detail"><strong>?</strong> Baths</span>
                    <span className="detail"><strong>— sq ft</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div style={{ marginBottom: 8, fontSize: 14, color: '#555' }}>
              Showing {filtered.length} result{filtered.length !== 1 && 's'}
              {typeFilter !== 'all' && ` in ${typeFilter}`}
            </div>
            <div className="properties-grid">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Search;
