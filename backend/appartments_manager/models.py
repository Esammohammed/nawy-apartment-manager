from django.db import models

# Create your models here.

class Apartment(models.Model):
    unit_name = models.CharField(max_length=255)
    unit_number = models.CharField(max_length=50)
    area = models.DecimalField(max_digits=6, decimal_places=2)  # e.g., 120.50 sq meters
    price = models.DecimalField(max_digits=12, decimal_places=2)  # e.g., 1500000.00
    number_of_rooms = models.PositiveIntegerField()
    number_of_bathrooms = models.PositiveIntegerField()
    has_balcony = models.BooleanField(default=False)
    floor = models.PositiveIntegerField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.unit_name} ({self.unit_number})"


class ApartmentImage(models.Model):
    apartment = models.ForeignKey(Apartment, related_name="images", on_delete=models.CASCADE)
    image_url = models.URLField()

    def __str__(self):
        return f"Image for {self.apartment.unit_name} ({self.apartment.unit_number})"