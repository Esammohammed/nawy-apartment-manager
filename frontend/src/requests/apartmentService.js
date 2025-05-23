const API_BASE = 'http://localhost:8000';

export async function fetchApartments() {
  const res = await fetch(`${API_BASE}/apartments/apartments/`);
  if (!res.ok) throw new Error('Failed to fetch apartments');
  return await res.json();
}

export async function fetchApartmentById(id) {
  const res = await fetch(`${API_BASE}/apartments/apartments/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch apartment details');
  return await res.json();
}

export async function createApartment(apartmentData) {
  const res = await fetch(`${API_BASE}/apartments/apartments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apartmentData),
  });
  if (!res.ok) throw new Error('Failed to create apartment');
  return await res.json();
}

export async function uploadApartmentImages(apartmentId, images) {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('images', image);
  });

  const res = await fetch(`${API_BASE}/apartments/apartments/${apartmentId}/images/`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload images');
  }
  return await res.json();
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload-image/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload image');
  }
  return await res.json();
}