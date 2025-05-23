import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ApartmentCard.module.css';

function ApartmentCard({ apartment }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = apartment.images || [];

  const showNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.card} onClick={() => navigate(`/apartments/${apartment.id}`)}>
      <div className={styles.imageContainer}>
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex].image_url} 
              alt={`${apartment.unit_name} - Image ${currentImageIndex + 1}`}
              className={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.jpg';
              }}
            />
            {images.length > 1 && (
              <div className={styles.imageNavControls}>
                <button 
                  className={styles.navButton}
                  onClick={showPrevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button 
                  className={styles.navButton}
                  onClick={showNextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImages}>No images available</div>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{apartment.unit_name}</h3>
        <p className={styles.unitNumber}>#{apartment.unit_number}</p>
        <p className={styles.price}>${Number(apartment.price).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ApartmentCard;