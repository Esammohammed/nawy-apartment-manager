
from appartments_manager.models import Apartment, ApartmentImage
class ApartmentsManagerRepository:

 

    def get_apartments(self):
        """
        Fetch all apartments from the database.
        """
        return Apartment.objects.all()

    
    def get_apartment_by_id(self, apartment_id):
        """
        Fetch a single apartment by its ID.
        """
        try:
            return Apartment.objects.get(id=apartment_id)
        except Apartment.DoesNotExist:
            return None
    
    def create_apartment_with_images(self, unit_name=None, unit_number=None, area=None, price=None, number_of_rooms=None, number_of_bathrooms=None, has_balcony=False, floor=None, is_available=True, image_urls=None):
        """
        Create a new apartment with associated images.
        """
        apartment = Apartment.objects.create(
            unit_name=unit_name,
            unit_number=unit_number,
            area=area,
            price=price,
            number_of_rooms=number_of_rooms,
            number_of_bathrooms=number_of_bathrooms,
            has_balcony=has_balcony,
            floor=floor,
            is_available=is_available
        )
        
        if image_urls:
            for image_url in image_urls:
                ApartmentImage.objects.create(apartment=apartment, image_url=image_url)
        return apartment