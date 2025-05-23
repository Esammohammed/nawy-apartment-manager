import React, { useEffect, useState } from 'react';
import ApartmentCard from './ApartmentCard';
import { fetchApartments } from '../requests/apartmentService';
import styles from './ApartmentList.module.css';
import { useNavigate } from 'react-router-dom';

function ApartmentList() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getApartments() {
      try {
        const data = await fetchApartments();
        setApartments(data);
      } catch (error) {
        console.error('Failed to load apartments:', error);
      } finally {
        setLoading(false);
      }
    }

    getApartments();
  }, []);

  if (loading) return <p>Loading apartments...</p>;

  return (
    <div>
      <button 
        onClick={() => navigate('/apartments/new')}
        className={styles.addButton}
      >
        Add New Apartment
      </button>
      <div className={styles.list}>
        {apartments.map((apartment) => (
          <ApartmentCard key={apartment.id} apartment={apartment} />
        ))}
      </div>
    </div>
  );
}

export default ApartmentList;