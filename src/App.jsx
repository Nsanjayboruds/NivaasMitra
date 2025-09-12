"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import PropertyGallery from "./components/PropertyGallery";
import Pricing from "./components/Pricing";
import Blog from "./components/Blog";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import LoadingScreen from "./components/LoadingScreen";
import MobileOptimizations from "./utils/mobileOptimizations";
import "./App.css";
import "./styles/mobile-responsive.css";

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Search from "./components/Search";
import BlogPost from "./components/BlogPost";
import PropertyDetail from "./components/PropertyDetail";
import NotFound from "./components/NotFound";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRestoreAppliedRef = useRef(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    MobileOptimizations.init();

    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
      setShowScrollTop(totalScroll > 400); 

      
      const routeKey = location.pathname + location.search + location.hash;
      
      if (!handleScroll.rafPending) {
        handleScroll.rafPending = true;
        requestAnimationFrame(() => {
          try {
            sessionStorage.setItem("scroll:" + routeKey, String(totalScroll));
          } catch (e) { }
          handleScroll.rafPending = false;
        });
      }

      
      const sections = [
        "home",
        "about",
        "services",
        "properties",
        "pricing",
        "blog",
        "contact",
      ];
      const headerHeight = 80;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop - headerHeight - 100;
          if (totalScroll >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, location.search, location.hash]);

  
  useEffect(() => {
    if (scrollRestoreAppliedRef.current) return;
    window.history.scrollRestoration = 'manual';
    const routeKey = location.pathname + location.search + location.hash;
    let saved = null;
  try { saved = sessionStorage.getItem('scroll:' + routeKey); } catch (e) { }
    if (saved) {
      const target = parseInt(saved, 10) || 0;
      
      requestAnimationFrame(() => window.scrollTo(0, target));
      
      setTimeout(() => {
        if (Math.abs(window.scrollY - target) > 40) {
          window.scrollTo(0, target);
        }
      }, 350);
      scrollRestoreAppliedRef.current = true;
    }
  }, [location.pathname, location.search, location.hash]);

  
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const routeKey = location.pathname + location.search + location.hash;
        sessionStorage.setItem('scroll:' + routeKey, String(window.scrollY));
      } catch (e) { }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname, location.search, location.hash]);

  const scrollToSection = (sectionId) => {
    
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.offsetTop - headerHeight;

          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.offsetTop - headerHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      ></div>
      <Header activeSection={activeSection} onNavigate={scrollToSection} />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <section id="home" className="section">
                <Hero onExplore={() => scrollToSection("properties")} />
              </section>
              <section id="about" className="section">
                <About />
              </section>
              <section id="services" className="section">
                <Services />
              </section>
              <section id="properties" className="section">
                <PropertyGallery />
              </section>
              <section id="pricing" className="section">
                <Pricing onNavigateToContact={() => scrollToSection("contact")} />
              </section>
              <section id="blog" className="section">
                <Blog />
              </section>
              <section id="contact" className="section">
                <ContactForm />
              </section>
            </main>
          }
        />
        <Route path="/search" element={<Search />} />
  <Route path="/blog/:id" element={<BlogPost />} />
  <Route path="/property/:id" element={<PropertyDetail />} />
  {/* Catch-all 404 route MUST stay last */}
  <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Chatbot />
      {showScrollTop && (
        <button
          aria-label="Scroll to top"
          className="scroll-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
