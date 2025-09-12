"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageSquare,
  DollarSign,
  Home,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = {
        ...formData,
        access_key: import.meta.env.VITE_WEB3FORM_ACCESS_KEY,
        subject: "MakaanWala Contact Form",
        from_name: formData.name,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          propertyType: "",
          budget: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="contact-form-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <Phone size={20} />
            Get In Touch
          </div>
          <h2>Let&apos;s Find Your Dream Property</h2>
          <p>
            Ready to take the next step? Our expert team is here to help you
            find your perfect property.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <div className="info-content">
                <h4>Visit Our Office</h4>
                <p>3828 Piermont Dr, Albuquerque, NM 87112</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={24} />
              </div>
              <div className="info-content">
                <h4>Call Us</h4>
                <p>+91 99XXX XXXXX</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <div className="info-content">
                <h4>Email Us</h4>
                <p>support@makaanwala.com</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <div className="info-content">
                <h4>Working Hours</h4>
                <p>Mon-Fri: 9AM-7PM • Sat-Sun: 10AM-5PM</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Web3Forms hidden access key and honeypot field */}
            {/* Honeypot field for spam protection */}
            <input
              type="text"
              name="birthday"
              style={{ display: "none" }}
              tabIndex="-1"
              autoComplete="off"
            />
            <div className="form-header">
              <MessageSquare size={24} />
              <h3>Send us a Message</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">
                  <Home size={16} />
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget">
                <DollarSign size={16} />
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select Budget Range</option>
                <option value="under-30l">Under ₹30L</option>
                <option value="30l-50l">₹30L - ₹50L</option>
                <option value="50l-1cr">₹50L - ₹1Cr</option>
                <option value="1cr-2cr">₹1Cr - ₹2Cr</option>
                <option value="over-2cr">Over ₹2Cr</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                <MessageSquare size={16} />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your property requirements..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <div className="form-message success" role="status" aria-live="polite">
                <CheckCircle size={20} />
                Thanks for contacting us! We will get back to you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="form-message error">
                <AlertCircle size={20} />
                Sorry, there was an error sending your message. Please try
                again.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
