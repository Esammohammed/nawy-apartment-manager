from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

from appartments_manager.reposotiries import ApartmentsManagerRepository
from appartments_manager.serializers import ApartmentSerializer
from django.core.files.storage import default_storage
from django.conf import settings
import os
import uuid
from django.http import FileResponse
from django.conf import settings
import os
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Apartment, ApartmentImage
from .file_utils import save_uploaded_file

class ApartmentView(APIView):
    """
    View to handle apartment-related operations.
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        """
        Handle GET requests to fetch all apartments.
        """
        apartments = ApartmentsManagerRepository().get_apartments()
        serializer = ApartmentSerializer(apartments, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        """
        Handle POST requests to create a new apartment.
        """
        serializer = ApartmentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            apartment = serializer.save()
            return Response(ApartmentSerializer(apartment, context={'request': request}).data, 
                          status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, apartment_id):
        """
        Handle PUT requests to update an existing apartment.
        """
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ApartmentSerializer(apartment, data=request.data, partial=True, 
                                       context={'request': request})
        if serializer.is_valid():
            apartment = serializer.save()
            return Response(ApartmentSerializer(apartment, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, apartment_id):
        """
        Handle DELETE requests to delete an apartment.
        """
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        apartment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ApartmentDetailView(APIView):
    """Handles retrieve (GET), update (PUT), delete (DELETE) for a single apartment"""
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, apartment_id):
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApartmentSerializer(apartment, context={'request': request})
        return Response(serializer.data)

    def put(self, request, apartment_id):
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApartmentSerializer(apartment, data=request.data, partial=True, 
                                       context={'request': request})
        if serializer.is_valid():
            apartment = serializer.save()
            return Response(ApartmentSerializer(apartment, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, apartment_id):
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)

        apartment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ImageView(APIView):
    """Handles image uploads separately"""
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate unique filename
        ext = os.path.splitext(file.name)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join('apartment_images', filename)
        
        # Save file
        saved_path = default_storage.save(filepath, file)
        
        return Response({
            'image_path': saved_path,
            'image_url': request.build_absolute_uri(f'/media/{saved_path}')
        }, status=status.HTTP_201_CREATED)
    
    def get(self, request, image_path):
        # Construct the full filesystem path
        full_path = os.path.join(settings.MEDIA_ROOT, image_path)
        
        # Security check - prevent directory traversal
        if not os.path.exists(full_path) or not full_path.startswith(settings.MEDIA_ROOT):
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Return the image file
        return FileResponse(open(full_path, 'rb'), content_type='image/jpeg')

class ApartmentImageView(APIView):
    parser_classes = [MultiPartParser]
    
    def post(self, request, apartment_id):
        apartment = get_object_or_404(Apartment, pk=apartment_id)
        images = request.FILES.getlist('images')
        
        if not images:
            return Response(
                {"error": "No images provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_images = []
        for image_file in images:
            # Save file and get path
            saved_path = save_uploaded_file(image_file)
            
            # Create record with just the path
            img = ApartmentImage.objects.create(
                apartment=apartment,
                image_path=saved_path
            )
            created_images.append({
                'id': img.id,
                'image_path': img.image_path,
                'image_url': request.build_absolute_uri(f'/media/{saved_path}')
            })
            
        return Response(created_images, status=status.HTTP_201_CREATED)
    
