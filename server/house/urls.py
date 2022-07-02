from django.urls import path
from .views import upload_images

app_name = "house"

urlpatterns = [
    path("upload-images/", upload_images, name="upload_house_images"),
]