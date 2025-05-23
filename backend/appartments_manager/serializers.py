from rest_framework import serializers
from .models import Apartment, ApartmentImage
from django.conf import settings

class ApartmentImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ApartmentImage
        fields = ['id', 'image_path', 'image_url', 'created_at']
        read_only_fields = ['created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_path:
            return request.build_absolute_uri(f'/media/{obj.image_path}') if request else f'/media/{obj.image_path}'
        return None

class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Apartment
        fields = '__all__'
        extra_fields = ['uploaded_images']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        apartment = Apartment.objects.create(**validated_data)
        
        for image_path in uploaded_images:
            ApartmentImage.objects.create(apartment=apartment, image_path=image_path)
        
        return apartment