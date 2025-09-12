"use client";

import { useState, useMemo } from "react";
import propertiesData from "../data/properties";
import PropertyCard from './PropertyCard';
// Removed unused imports for action buttons
import "./PropertyGallery.css";

const PropertyGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const properties = propertiesData; // direct reference (static array)

  const filteredProperties = useMemo(() => {
    let filtered = properties;

    if (activeFilter !== "all") {
      filtered = filtered.filter((property) => property.type === activeFilter);
    }

    if (priceRange !== "all") {
      filtered = filtered.filter((property) => {
        const price = Number.parseInt(property.price.replace(/[₹,]/g, ""));
        switch (priceRange) {
          case "under-50l":
            return price < 5000000;
          case "50l-1cr":
            return price >= 5000000 && price < 10000000;
          case "over-1cr":
            return price >= 10000000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [activeFilter, priceRange, properties]);



  // PropertyActions component removed - no action buttons needed

  const filters = [
    { id: "all", label: "All Properties" },
    { id: "apartment", label: "Apartments" },
    { id: "villa", label: "Villas" },
    { id: "commercial", label: "Commercial" },
  ];

  return (
    <section className="property-gallery">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>🏘️</span>
            Featured Properties
          </div>
          <h2>Discover Premium Properties</h2>
          <p>Handpicked selection of the finest real estate opportunities</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Property Type:</label>
            <div className="filter-buttons">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-btn ${
                    activeFilter === filter.id ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Price Range:</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="price-filter"
            >
              <option value="all">All Prices</option>
              <option value="under-50l">Under ₹50L</option>
              <option value="50l-1cr">₹50L - ₹1Cr</option>
              <option value="over-1cr">Over ₹1Cr</option>
            </select>
          </div>
        </div>

        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="no-results">
            <p>No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyGallery;
