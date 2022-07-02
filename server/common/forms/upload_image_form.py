from django.forms import Form
from django import forms

class UploadImageForm(Form):
    main_image = forms.ImageField(required=True)
    detail_images = forms.ImageField(required=True)
    