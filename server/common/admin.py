from django.contrib import admin

from common.models import City, District, Ward
# Register your models here.

admin.site.register(City)
admin.site.register(District)
admin.site.register(Ward)