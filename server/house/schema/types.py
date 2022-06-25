from graphene_django import DjangoObjectType

from house.models import HouseImage, House


class HouseImageType(DjangoObjectType):
    class Meta:
        model = HouseImage


class HouseType(DjangoObjectType):
    class Meta:
        model = House