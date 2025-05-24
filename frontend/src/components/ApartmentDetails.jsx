import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApartmentById } from '../requests/apartmentService';
import styles from './ApartmentDetails.module.css';

const fields = [
  { key: 'area', label: 'Area', format: v => `${v} m²` },
  { key: 'price', label: 'Price', format: v => `$${Number(v).toLocaleString()}` },
  { key: 'number_of_rooms', label: 'Rooms' },
  { key: 'number_of_bathrooms', label: 'Bathrooms' },
  { key: 'has_balcony', label: 'Balcony', format: v => (v ? 'Yes' : 'No') },
  { key: 'floor', label: 'Floor' },
  { key: 'is_available', label: 'Available', format: v => (v ? 'Yes' : 'No') },
];

function ApartmentDetailsPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchApartmentById(id)
      .then(data => {
        setApartment(data);
        setCurrentImageIndex(0); // reset image index
      })
      .catch(console.error);
  }, [id]);

  if (!apartment) return <p className={styles.loading}>Loading apartment details...</p>;

  const images = apartment.images || [];

  const showNextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const showPrevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {apartment.unit_name} #{apartment.unit_number}
      </h2>

      <div className={styles.imageWrapper}>
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex].image_url}
              alt={`Apartment image ${currentImageIndex + 1}`}
              className={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.jpg';
              }}
            />
            {images.length > 1 && (
              <div className={styles.imageNavControls}>
                <button onClick={showPrevImage} className={styles.navButton}>‹</button>
                <button onClick={showNextImage} className={styles.navButton}>›</button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImages}>No images available</div>
        )}
      </div>

      <ul className={styles.infoList}>
        {fields.map(({ key, label, format }) => (
          <li key={key} className={styles.infoItem}>
            <strong>{label}:</strong>{" "}
            {apartment[key] != null
              ? (format ? format(apartment[key]) : apartment[key])
              : "-"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApartmentDetailsPage;
