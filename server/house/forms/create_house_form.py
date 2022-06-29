from django.forms import (
    ModelForm, 
    ValidationError
)
from django import forms

from house.models import House


class CreateHouseForm(ModelForm):
    # min and max value depend on city, district, ward id
    city_id = forms.IntegerField(min_value=1, max_value=63) 
    district_id = forms.IntegerField(min_value=1, max_value=709)
    ward_id = forms.IntegerField(min_value=1, max_value=11283)

    class Meta:
        model = House
        fields = [
            'name',
            'address', 
            'area', 
            'number_of_floor', 
            'description'
        ]

    def clean_name(self):
        if self.data["name"].strip() == "":
            raise ValidationError("Name is required")
        return self.data["name"]

    def clean_address(self):
        print("Address:", self.data["address"])
        if self.data["address"].strip() == "":
            raise ValidationError("Address is required")
        return self.data["address"]
    
    def clean_area(self):
        if self.data["area"] <= 0:
            raise ValidationError("Area do not allow negative and zero value")
        return self.data["area"]
    
    def clean_number_of_floor(self):
        if self.data["number_of_floor"] <= 0:
            raise ValidationError("Number of floor do not allow negative and zero value")
        return self.data["number_of_floor"]