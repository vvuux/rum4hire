from django.db import models
import uuid
from django.utils import timezone

# Create your models here.
class Common(models.Model):
    uuid = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    class Meta:
        abstract = True
        ordering = ['-created_at']


class City(models.Model):
    id = models.PositiveIntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Cities"

    
    def __str__(self):
        return self.name


class District(models.Model):
    id = models.PositiveIntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    city = models.ForeignKey(
        City,
        related_name="districts",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name


class Ward(models.Model):
    id = models.PositiveIntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    prefix = models.CharField(max_length=20)
    district = models.ForeignKey(
        District,
        related_name="wards",
        on_delete=models.CASCADE        
    )

    def __str__(self):
        return self.name


class Image(models.Model):
    main_image = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    class Meta:
        abstract = True
        ordering = ['-created_at']