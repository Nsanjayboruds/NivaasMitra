import { useNavigate } from 'react-router-dom';

// Reusable property card matching gallery styling
const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  if (!property) return null;

  const to = `/property/${property.slug || property.id}`;

  return (
    <div
      className="property-card"
      onClick={() => navigate(to)}
      style={{ cursor: 'pointer' }}
    >
      {property.featured && (
        <div className="featured-badge">Featured</div>
      )}
      <div className="property-image">
        <img
          src={property.image || '/placeholder.svg'}
          alt={property.title}
        />
        <div className="property-overlay">
          <button
            className="view-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(to);
            }}
          >
            View Details
          </button>
        </div>
      </div>
      <div className="property-info">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">{property.location}</p>
        <div className="property-price">{property.price}</div>
        <div className="property-details">
          {property.bedrooms > 0 && (
            <span className="detail">
              <strong>{property.bedrooms}</strong> Beds
            </span>
          )}
            <span className="detail">
              <strong>{property.bathrooms}</strong> Baths
            </span>
            <span className="detail">
              <strong>{property.area}</strong>
            </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
