import os
from django.core.files.storage import default_storage
from django.conf import settings
import uuid

def save_uploaded_file(file):
    # Generate unique filename
    ext = os.path.splitext(file.name)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join('apartment_images', filename)
    
    # Save file to filesystem
    saved_path = default_storage.save(filepath, file)
    return saved_path