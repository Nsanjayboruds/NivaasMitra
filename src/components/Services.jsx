"use client"

import { useState } from "react"
import "./Services.css"

const Services = () => {
  const [activeService, setActiveService] = useState(0)

  const services = [
    {
      title: "Property Buying",
      icon: "🏠",
      description: "Find your dream home with our expert guidance and market insights.",
      features: [
        "Personalized property search",
        "Market analysis and pricing",
        "Negotiation support",
        "Legal documentation assistance",
        "Post-purchase support",
      ],
      process: [
        "Initial consultation and needs assessment",
        "Property search and shortlisting",
        "Property viewings and inspections",
        "Offer negotiation and acceptance",
        "Legal process and closing",
      ],
    },
    {
      title: "Property Selling",
      icon: "💰",
      description: "Maximize your property value with our proven selling strategies.",
      features: [
        "Professional property valuation",
        "Marketing and advertising",
        "Professional photography",
        "Buyer screening and qualification",
        "Closing coordination",
      ],
      process: [
        "Property evaluation and pricing strategy",
        "Professional staging and photography",
        "Multi-channel marketing campaign",
        "Buyer tours and negotiations",
        "Sale completion and handover",
      ],
    },
    {
      title: "Investment Consulting",
      icon: "📈",
      description: "Strategic investment advice to build your real estate portfolio.",
      features: [
        "Market research and analysis",
        "Investment strategy development",
        "Portfolio diversification",
        "ROI optimization",
        "Risk assessment",
      ],
      process: [
        "Investment goals assessment",
        "Market opportunity analysis",
        "Property selection and due diligence",
        "Investment execution",
        "Performance monitoring and optimization",
      ],
    },
    {
      title: "Commercial Real Estate",
      icon: "🏢",
      description: "Specialized services for commercial property transactions and leasing.",
      features: [
        "Commercial property search",
        "Lease negotiation",
        "Investment analysis",
        "Zoning and permits assistance",
        "Market intelligence",
      ],
      process: [
        "Business requirements analysis",
        "Location and property identification",
        "Financial analysis and structuring",
        "Negotiation and documentation",
        "Occupancy and ongoing support",
      ],
    },
    {
      title: "Relocation Services",
      icon: "🚚",
      description: "Complete relocation support for individuals and corporate clients.",
      features: [
        "Area orientation and tours",
        "School and amenity research",
        "Temporary accommodation",
        "Moving coordination",
        "Settling-in support",
      ],
      process: [
        "Relocation needs assessment",
        "Destination area research",
        "Property search and selection",
        "Moving logistics coordination",
        "Post-move support and follow-up",
      ],
    },
  ]

  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>🔧</span>
            Our Services
          </div>
          <h2>Comprehensive Real Estate Solutions</h2>
          <p>Tailored services to meet all your property needs</p>
        </div>

        <div className="services-tabs">
          {services.map((service, index) => (
            <button
              key={index}
              className={`service-tab ${activeService === index ? "active" : ""}`}
              onClick={() => setActiveService(index)}
            >
              <span className="tab-icon">{service.icon}</span>
              <span className="tab-title">{service.title}</span>
            </button>
          ))}
        </div>

        <div className="service-content">
          <div className="service-overview">
            <div className="service-header">
              <div className="service-icon">{services[activeService].icon}</div>
              <div>
                <h3>{services[activeService].title}</h3>
                <p>{services[activeService].description}</p>
              </div>
            </div>

            <div className="service-details">
              <div className="service-features">
                <h4>What We Offer</h4>
                <ul>
                  {services[activeService].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="service-process">
                <h4>Our Process</h4>
                <div className="process-steps">
                  {services[activeService].process.map((step, index) => (
                    <div key={index} className="process-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-text">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3>Ready to Get Started?</h3>
          <p>Contact us today for a free consultation and let us help you achieve your real estate goals.</p>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Free Consultation
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
