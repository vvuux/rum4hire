from django.contrib import admin

from .models import (
    House,
    HouseImage
)

# Register your models here.
admin.site.register(House)
admin.site.register(HouseImage)