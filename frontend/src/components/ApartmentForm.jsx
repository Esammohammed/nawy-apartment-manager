import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApartment, uploadApartmentImages } from '../requests/apartmentService';
import styles from './ApartmentForm.module.css';

const ApartmentForm = () => {
  const [formData, setFormData] = useState({
    unit_name: '',
    unit_number: '',
    area: '',
    price: '',
    number_of_rooms: '',
    number_of_bathrooms: '',
    floor: '',
    has_balcony: false,
    is_available: true
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    const filePreviews = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviews(filePreviews);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Convert empty strings to null for number fields
      const processedData = {
        ...formData,
        area: formData.area === '' ? null : Number(formData.area),
        price: formData.price === '' ? null : Number(formData.price),
        number_of_rooms: formData.number_of_rooms === '' ? null : Number(formData.number_of_rooms),
        number_of_bathrooms: formData.number_of_bathrooms === '' ? null : Number(formData.number_of_bathrooms),
        floor: formData.floor === '' ? null : Number(formData.floor)
      };

      // Create apartment first
      const apartment = await createApartment(processedData);

      // Upload images if any
      if (files.length > 0) {
        await uploadApartmentImages(apartment.id, files);
      }

      navigate('/');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to create apartment. Please try again.');
    } finally {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add New Apartment</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Apartment Information Fields */}
        <div className={styles.formGroup}>
          <label>Unit Name:</label>
          <input
            type="text"
            name="unit_name"
            value={formData.unit_name}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Unit Number:</label>
          <input
            type="text"
            name="unit_number"
            value={formData.unit_number}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Area (m²):</label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Number of Rooms:</label>
          <input
            type="number"
            name="number_of_rooms"
            value={formData.number_of_rooms}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Number of Bathrooms:</label>
          <input
            type="number"
            name="number_of_bathrooms"
            value={formData.number_of_bathrooms}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Floor:</label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        {/* Checkbox Fields */}
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="has_balcony"
            checked={formData.has_balcony}
            onChange={handleChange}
            className={styles.checkboxInput}
            id="has_balcony"
          />
          <label htmlFor="has_balcony">Has Balcony</label>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
            className={styles.checkboxInput}
            id="is_available"
          />
          <label htmlFor="is_available">Is Available</label>
        </div>

        {/* Image Upload Section */}
        <div className={styles.formGroup}>
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className={styles.fileInput}
            id="apartment-images"
          />
          <label htmlFor="apartment-images" className={styles.fileInputLabel}>
            Choose Images
          </label>
          
          <div className={styles.imagePreviews}>
            {previews.map((preview, index) => (
              <div key={index} className={styles.previewItem}>
                <img 
                  src={preview.url} 
                  alt={`Preview ${index}`}
                  className={styles.previewImage}
                />
                <span className={styles.previewName}>{preview.name}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={styles.removeButton}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              Creating...
            </>
          ) : (
            'Create Apartment'
          )}
        </button>
      </form>
    </div>
  );
};

export default ApartmentForm;