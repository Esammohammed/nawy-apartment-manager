import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApartmentById } from '../requests/apartmentService';
import styles from './ApartmentDetails.module.css';

const fields = [
  { key: 'area', label: 'Area', format: v => `${v} m²` },
  { key: 'price', label: 'Price', format: v => `$${Number(v).toLocaleString()}` },
  { key: 'number_of_rooms', label: 'Rooms' },
  { key: 'number_of_bathrooms', label: 'Bathrooms' },
  { key: 'has_balcony', label: 'Balcony', format: v => v ? 'Yes' : 'No' },
  { key: 'floor', label: 'Floor' },
  { key: 'is_available', label: 'Available', format: v => v ? 'Yes' : 'No' },
];

function ApartmentDetailsPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    fetchApartmentById(id).then(setApartment).catch(console.error);
  }, [id]);

  if (!apartment) return <p>Loading...</p>;

  return (
    <div className={styles.details}>
      <h2>{apartment.unit_name} #{apartment.unit_number}</h2>
      <div className={styles.imageScroll}>
        {apartment.images?.map((img, i) => (
          <img key={i} src={img.image_url} alt={`Apartment ${i}`} />
        ))}
      </div>
      <ul className={styles.info}>
        {fields.map(({ key, label, format }) => (
          <li key={key}>
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
