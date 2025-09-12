import { useNavigate } from 'react-router-dom';
import './NotFound.css';

/**
 * Generic Not Found component for 404 pages and missing resources.
 * Props:
 *  - title: heading text
 *  - message: descriptive text
 *  - to: path to navigate on primary action
 *  - backLabel: label for primary button
 *  - children: optional extra actions/content
 */
const NotFound = ({
  title = 'Page Not Found',
  message = "The page you're looking for doesn't exist or may have been moved.",
  to = '/',
  backLabel = 'Go Home',
  children
}) => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-card">
          <div className="not-found-status">404</div>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className="not-found-actions">
            <button className="btn btn-primary" onClick={() => navigate(to)}>
              {backLabel}
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
