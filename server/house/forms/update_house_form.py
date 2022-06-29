from django.forms import (
    Form,
    ValidationError
)
from django import forms


class UpdateHouseForm(Form):
    city_id = forms.IntegerField(min_value=1, max_value=63, required=False) 
    district_id = forms.IntegerField(min_value=1, max_value=709, required=False)
    ward_id = forms.IntegerField(min_value=1, max_value=11283, required=False)
    name = forms.CharField(required=False, max_length=255, strip=True)
    address = forms.CharField(required=False, max_length=255, strip=True)
    area = forms.FloatField(required=False)
    number_of_floor = forms.IntegerField(required=False)
    description = forms.CharField(required=False, max_length=1023, strip=True)

    def clean_area(self):
        try:
            if self.data["area"] <= 0:
                raise ValidationError("Area do not allow negative and zero value")
            return self.data["area"]
        except KeyError as e:
            pass
    
    def clean_number_of_floor(self):
        try:
            if self.data["number_of_floor"] <= 0:
                raise ValidationError("Number of floor do not allow negative and zero value")
            return self.data["number_of_floor"]
        except KeyError as e:
            pass