from graphene_django import DjangoObjectType

from common.models import City, District, Ward


class CityType(DjangoObjectType):
    class Meta:
        model = City


class DistrictType(DjangoObjectType):
    class Meta:
        model = District


class WardType(DjangoObjectType):
    class Meta:
        model = Ward
