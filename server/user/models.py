from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class HouseOwner(AbstractUser):
    email = models.EmailField(
        max_length=255, 
        verbose_name='email',
        blank=False
    )
    phone = models.CharField(max_length=10)
    identify_number = models.CharField(max_length=12)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.email