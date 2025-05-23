from django.urls import path
from appartments_manager.views import ApartmentView

urlpatterns = [
    path('apartments/', ApartmentView.as_view(), name='apartment-list-create'),
    path('apartments/<int:apartment_id>/', ApartmentView.as_view(), name='apartment-detail'),
]