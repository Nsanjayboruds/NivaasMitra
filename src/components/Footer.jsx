import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  Home,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState({
    quick: false, 
    types: false,
    contact: false,
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  
  useEffect(() => {
    if (!isMobile) {
      
      setOpen({ quick: true, types: true, contact: true });
    } else {
      
      setOpen({ quick: false, types: false, contact: false });
    }
  }, [isMobile]);

  const toggle = (key) => {
    if (!isMobile) return; 
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <Home size={28} />
              </div>
              <h3>NivaasMitra</h3>
            </div>
            <p>
              Your trusted partner in finding the perfect property. Connecting dreams with reality across India.
            </p>
            <div className="social-links">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-link"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-link"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-link"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className={`footer-section footer-collapsible ${open.quick ? "open" : ""}`}>
            <button
              className="footer-toggle"
              aria-expanded={open.quick}
              aria-controls="footer-quick-links"
              onClick={() => toggle("quick")}
            >
              <span>Quick Links</span>
              <ChevronDown size={18} className="chevron" />
            </button>
            <div id="footer-quick-links" className="collapsible-content">
              <div className="footer-links-grid">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#properties">Properties</a>
                <a href="#blog">Blog</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>

            <div className={`footer-section footer-collapsible ${open.types ? "open" : ""}`}>
              <button
                className="footer-toggle"
                aria-expanded={open.types}
                aria-controls="footer-property-types"
                onClick={() => toggle("types")}
              >
                <span>Property Types</span>
                <ChevronDown size={18} className="chevron" />
              </button>
              <div id="footer-property-types" className="collapsible-content">
                <div className="footer-links-grid">
                  <a href="#">Apartments</a>
                  <a href="#">Villas</a>
                  <a href="#">Commercial</a>
                  <a href="#">Land</a>
                  <a href="#">Luxury Homes</a>
                  <a href="#">Investment</a>
                </div>
              </div>
            </div>

          <div className={`footer-section footer-contact footer-collapsible ${open.contact ? "open" : ""}`}>
            <button
              className="footer-toggle"
              aria-expanded={open.contact}
              aria-controls="footer-contact-info"
              onClick={() => toggle("contact")}
            >
              <span>Get In Touch</span>
              <ChevronDown size={18} className="chevron" />
            </button>
            <div id="footer-contact-info" className="collapsible-content">
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>3828 Piermont Dr, Albuquerque, NM 87112</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <a href="tel:+911145678900">+91 99XXX XXXXX</a>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <a href="mailto:support@NivaasMitra.com">support@NivaasMitra.com</a>
                </div>
                <div className="contact-item">
                  <Clock size={16} />
                  <span>Mon-Fri: 9AM-7PM<br />Sat-Sun: 10AM-5PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} NivaasMitra. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
