import { Home } from "lucide-react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-animation">
          <div className="logo-container">
            <div className="logo-icon">
              <Home size={48} />
            </div>
            <h1>NivaasMitra</h1>
          </div>
          <div className="logo-tagline">Your Dream Home Awaits</div>
        </div>

        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        <p className="loading-text">Loading your perfect home...</p>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
