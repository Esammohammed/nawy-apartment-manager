from django.urls import path
from appartments_manager.views import ApartmentDetailView, ApartmentImageView, ApartmentView , ImageView

urlpatterns = [
    path('apartments/', ApartmentView.as_view(), name='apartment-list-create'),
    path('apartments/<int:apartment_id>/', ApartmentDetailView.as_view(), name='apartment-detail'),
    path('upload-image/', ImageView.as_view(), name='upload-image'),
    path('images/<path:image_path>', ImageView.as_view(), name='get-image'),
    path('apartments/<int:apartment_id>/images/', ApartmentImageView.as_view(), name='apartment-images'),
  
]