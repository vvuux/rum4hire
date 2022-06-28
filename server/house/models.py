from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.conf import settings
from django.db.transaction import atomic
from django.db.models.signals import post_save
from django.conf import settings

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

    def save(self, *args, **kwargs):
        if self.main_image and self.deleted_at == None:
            # soft delete manually because of execution of save() method happening twice  
            try:
                old_main_image = HouseImage.objects.filter(
                    house=self.house, 
                    main_image=True, 
                    deleted_at=None
                )
                old_main_image.update(deleted_at=timezone.now())
            except HouseImage.DoesNotExist:
                pass

        elif self.main_image == False and self.deleted_at == None:
            current_details_image = HouseImage.objects.filter(
                house=self.house, 
                main_image=False, 
                deleted_at=None)\
                    .order_by('created_at') 
            if len(current_details_image) + 1 > settings.MAXIMUM_IMAGE_ACTIVE:
                current_details_image[0:1].update(deleted_at=timezone.now())
        
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['house__name', 'main_image', '-created_at', '-deleted_at']

    def __str__(self):
        if self.deleted_at == None:
            act_str = "Alive"
        else:
            act_str = "Deleted"
        
        if self.main_image:
            main_str = "Main"
        else:
            main_str = "Details"
        return f"{self.uuid} - {self.house.name} - {act_str} - {main_str}"

class House(Common):

    class RequestStatus(models.TextChoices):
        ACCEPT = "Accept", _("Accept")
        REJECT = "Reject", _("Reject")
        PENDING = "Pending", _("Pending")

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


def house_image_post_save(sender, instance, *args, **kwargs):
    try:
        print("post_save")
        obj_house = instance.house
        if instance.main_image and instance.deleted_at == None:
            obj_house.main_image = [{
                'uuid': instance.uuid,
                'image': instance.image.url,
                'main_image': instance.main_image,
                'created_at': instance.created_at,
            }]
        
        elif instance.main_image == False and instance.deleted_at == None:
            if len(obj_house.detail_images) + 1 > settings.MAXIMUM_IMAGE_ACTIVE:
                obj_house.detail_images.pop(0)
            obj_house.detail_images.append({
                'uuid': instance.uuid,
                'image': instance.image.url,
                'main_image': instance.main_image,
                'created_at': instance.created_at,
            })
        
        obj_house.save() 

    except Exception as e:
        pass


post_save.connect(house_image_post_save, HouseImage)