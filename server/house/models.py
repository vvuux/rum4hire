from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.conf import settings
from django.db.transaction import atomic

from common.models import (
    Common,
    City,
    District,
    Ward 
)
from user.models import HouseOwner
from common.models import Image
from .storages_backend import HouseImageStorage
from common.serializers import ImageEncoder

# Create your models here.


def house_image_upload_dir(instance, filename):
    return f"{settings.MEDIA_URL}house/{instance.uuid}_{timezone.now()}_{filename}"


class HouseImage(Image):
    house = models.ForeignKey(
        "House",
        related_name="house_images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to=house_image_upload_dir, 
        storage=HouseImageStorage
    )


class House(Common):

    class RequestStatus(models.TextChoices):
        ACCEPT = 1, _("Accept")
        REJECT = 2, _("Reject")
        PENDING = 3, _("Pending")

    owner = models.ForeignKey(
        HouseOwner,
        on_delete=models.CASCADE,
        related_name="houses"
    )
    name = models.CharField(max_length=225)
    city = models.ForeignKey(
        City, 
        related_name="houses",
        on_delete=models.SET_NULL,
        null=True
    )
    district = models.ForeignKey(
        District,
        related_name="houses",
        on_delete=models.SET_NULL,
        null=True
    )
    ward = models.ForeignKey(
        Ward,
        related_name="houses",
        on_delete=models.SET_NULL,
        null=True
    )
    request_status = models.CharField(
        max_length=20,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING
    )
    address = models.CharField(max_length=255)
    number_of_floor = models.PositiveIntegerField()
    area = models.FloatField()
    full_address = models.CharField(max_length=255, blank=True)
    description = models.TextField(max_length=1023,blank=True)
    main_image = models.JSONField(
        default=list, 
        blank=True, 
        encoder=ImageEncoder)
    detail_images = models.JSONField(
        default=list, 
        blank=True, 
        encoder=ImageEncoder
    )

    def save(self, *args, **kwargs):
        self.full_address = f"{self.address}, {self.ward}, {self.district}, {self.city}"
        return super().save(*args, **kwargs)