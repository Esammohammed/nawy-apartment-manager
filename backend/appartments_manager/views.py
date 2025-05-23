from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from appartments_manager.reposotiries import ApartmentsManagerRepository
from appartments_manager.serializers import ApartmentSerializer

# Create your views here.


class ApartmentView(APIView):
    """
    View to handle apartment-related operations.
    """

    def get(self, request):
        """
        Handle GET requests to fetch all apartments.
        """
        print ("*"*50)
        print ("request: ", request)
        apartments = ApartmentsManagerRepository().get_apartments()
        print ("apartments: ", apartments)
        serializer = ApartmentSerializer(apartments, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """
        Handle POST requests to create a new apartment.
        """
        serializer = ApartmentSerializer(data=request.data)
        if serializer.is_valid():
            apartment = serializer.save()
            return Response(ApartmentSerializer(apartment).data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, apartment_id):
        """
        Handle PUT requests to update an existing apartment.
        """
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=404)
        
        serializer = ApartmentSerializer(apartment, data=request.data, partial=True)
        if serializer.is_valid():
            apartment = serializer.save()
            return Response(ApartmentSerializer(apartment).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, apartment_id):
        """
        Handle DELETE requests to delete an apartment.
        """
        apartment = ApartmentsManagerRepository().get_apartment_by_id(apartment_id)
        if not apartment:
            return Response({"error": "Apartment not found"}, status=404)
        
        apartment.delete()
        return Response(status=204)
    