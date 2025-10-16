"use client";

import { useState } from "react";
import "./Pricing.css";

const Pricing = ({ onNavigateToContact }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for first-time buyers and sellers",
      monthlyPrice: 2999,
      annualPrice: 29999,
      features: [
        "Property search assistance",
        "Basic market analysis",
        "Email support",
        "Property viewing coordination",
        "Basic negotiation support",
        "Standard documentation help",
      ],
      limitations: ["Up to 5 property viewings", "Email support only", "Basic market reports"],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      description: "Comprehensive service for serious buyers and sellers",
      monthlyPrice: 5999,
      annualPrice: 59999,
      features: [
        "Unlimited property search",
        "Detailed market analysis",
        "Priority phone & email support",
        "Professional photography",
        "Expert negotiation support",
        "Complete legal assistance",
        "Marketing campaign management",
        "Staging consultation",
      ],
      limitations: [],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      description: "VIP service with dedicated agent and concierge support",
      monthlyPrice: 11999,
      annualPrice: 119999,
      features: [
        "Dedicated personal agent",
        "24/7 concierge support",
        "Premium market insights",
        "Professional staging service",
        "Luxury marketing package",
        "Priority access to listings",
        "Investment consultation",
        "Relocation assistance",
        "Post-sale support",
      ],
      limitations: [],
      popular: false,
    },
  ];

  const additionalServices = [
    {
      name: "Professional Photography",
      price: 8999,
      description: "High-quality photos and virtual tours",
    },
    {
      name: "Market Analysis Report",
      price: 4499,
      description: "Detailed comparative market analysis",
    },
    {
      name: "Legal Document Review",
      price: 7499,
      description: "Professional legal document assistance",
    },
  ];

  // ✅ Razorpay payment handler
 const handlePayment = async (amount, planName) => {
  try {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const res = await fetch(`${BACKEND_URL}/create-order`, { method: "POST" });
    const order = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "NivaasMitra",
      description: `${planName} Plan Subscription`,
      order_id: order.id,
      handler: function (response) {
        alert(
          `✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nPlan: ${planName}`
        );
        console.log(response);
      },
      prefill: {
        name: "Test User",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: { color: "#4CAF50" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment Error:", error);
    alert("❌ Something went wrong. Please try again.");
  }
};


  return (
    <section className="pricing-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>💰</span>
            Transparent Pricing
          </div>
          <h2>Choose Your Perfect Plan</h2>
          <p>Flexible pricing options for all your real estate needs</p>
        </div>

        <div className="billing-toggle">
          <span className={!isAnnual ? "active" : ""}>Monthly</span>
          <button
            className={`toggle-switch ${isAnnual ? "annual" : ""}`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="toggle-slider"></div>
          </button>
          <span className={isAnnual ? "active" : ""}>
            Annual <span className="discount-badge">Save 20%</span>
          </span>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}

              <div className="plan-header">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="period">/month</span>
                </div>
                {isAnnual && (
                  <div className="annual-savings">
                    Save ₹{plan.monthlyPrice * 12 - plan.annualPrice} annually
                  </div>
                )}
              </div>

              <div className="plan-features">
                <h4>What's Included:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="included">
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <>
                    <h4>Limitations:</h4>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="limitation">
                          <span className="limit-icon">⚠</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* ✅ Razorpay Button */}
              <button
                className="btn btn-primary"
                onClick={() =>
                  handlePayment(isAnnual ? plan.annualPrice : plan.monthlyPrice, plan.name)
                }
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        <div className="additional-services">
          <h3>Additional Services</h3>
          <p>Enhance your experience with our premium add-on services</p>

          <div className="services-grid">
            {additionalServices.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-info">
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                </div>
                <div className="service-price">
                  <span className="price">₹{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-cta">
          <h3>Ready to Get Started?</h3>
          <p>Contact us today for a personalized consultation and custom pricing options.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={onNavigateToContact}>
              Start Free Consultation
            </button>
            <button className="btn btn-secondary" onClick={onNavigateToContact}>
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
