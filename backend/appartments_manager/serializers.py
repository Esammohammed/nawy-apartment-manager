from rest_framework import serializers
from .models import Apartment, ApartmentImage

class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image_url']

class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Apartment
        fields = [
            'id',
            'unit_name',
            'unit_number',
            'area',
            'price',
            'number_of_rooms',
            'number_of_bathrooms',
            'has_balcony',
            'floor',
            'is_available',
            'images'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        apartment = Apartment.objects.create(**validated_data)
        for image_data in images_data:
            ApartmentImage.objects.create(apartment=apartment, **image_data)
        return apartment