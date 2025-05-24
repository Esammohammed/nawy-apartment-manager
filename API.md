# API Documentation

**Base URL:**  
`http://localhost:8000/apartments`

---

## 1. List All Apartments

- **URL:** `/apartments/`
- **Method:** `GET`
- **Auth Required:** No

**Response:**
```json
[
    {
        "id": 1,
        "name": "Apartment A",
        "unit_number": 101,
        "unit_name": "5",
        "images": [
            {
                "id": 1,
                "image_path": "apartment_images/uuid.jpg",
                "image_url": "http://localhost:8000/media/apartment_images/uuid.jpg"
            }
        ]
    },
    ...
]
```

---

## 2. Create Apartment

- **URL:** `/apartments/`
- **Method:** `POST`
- **Auth Required:** No

**Request Body (multipart/form-data or JSON):**
```json
{
    "name": "Apartment A",
    "unit_number": 101,
    "unit_name": "5",
    "images": []
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Apartment A",
    "unit_number": 101,
    "unit_name": "5",
    "images": []
}
```

---

## 3. Get Apartment by ID

- **URL:** `/apartments/{apartment_id}/`
- **Method:** `GET`
- **Auth Required:** No

**Response:**
```json
{
    "id": 1,
    "name": "Apartment A",
    "unit_number": 101,
    "unit_name": "5",
    "images": [
        {
            "id": 1,
            "image_path": "apartment_images/uuid.jpg",
            "image_url": "http://localhost:8000/media/apartment_images/uuid.jpg"
        }
    ]
}
```
---

## 4. Upload Image

- **URL:** `/upload-image/`
- **Method:** `POST`
- **Auth Required:** No

**Request Body (multipart/form-data):**
- `file`: image file

**Response:**
```json
{
    "image_path": "apartment_images/uuid.jpg",
    "image_url": "http://localhost:8000/media/apartment_images/uuid.jpg"
}
```

---

## 5. Get Uploaded Image

- **URL:** `/images/{image_path}`
- **Method:** `GET`
- **Returns:** The actual image file

---

## 6. Upload Multiple Images for an Apartment

- **URL:** `/apartments/{apartment_id}/images/`
- **Method:** `POST`
- **Auth Required:** No

**Request Body (multipart/form-data):**
- `images`: list of image files

**Response:**
```json
[
    {
        "id": 1,
        "image_path": "apartment_images/uuid.jpg",
        "image_url": "http://localhost:8000/media/apartment_images/uuid.jpg"
    },
    ...
]
```
---

## 7. Update Apartment

- **URL:** `/apartments/{apartment_id}/`
- **Method:** `PUT`
- **Auth Required:** No

**Request Body (partial or full):**
```json
{
    "name": "Updated Name",
    "unit_number": 102
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Updated Name",
    "unit_number": 102,
    "unit_name": "5",
    "images": [...]
}
```

---

## 8. Delete Apartment

- **URL:** `/apartments/{apartment_id}/`
- **Method:** `DELETE`
- **Auth Required:** No

**Response:**  
- Status: `204 No Content` (empty body)



---

## License

This project is licensed under the MIT License.