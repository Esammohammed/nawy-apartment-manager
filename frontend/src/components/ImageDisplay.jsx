import React, { useState, useEffect } from 'react';
import styles from './ImageDisplay.module.css';

const ImageDisplay = ({ imagePath }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Construct the full image URL
        const url = `http://localhost:8000/media/${imagePath}`;
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };
    
    loadImage();
  }, [imagePath]);

  if (!imageUrl) return <div className={styles.loading}>Loading image...</div>;

  return (
    <img 
      src={imageUrl} 
      alt="Apartment" 
      className={styles.image}
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = '/placeholder.jpg';
      }}
    />
  );
};

export default ImageDisplay;