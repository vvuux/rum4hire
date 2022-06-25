import graphene

from common.models import City, District, Ward
from common.schema.types import CityType, DistrictType, WardType


class Query(graphene.ObjectType):
    get_all_cities = graphene.List(CityType)
    get_districts_in_city = graphene.List(DistrictType, city_id=graphene.String())
    get_wards_in_district = graphene.List(WardType, district_id=graphene.String())
    
    def resolve_get_all_cities(root, info, *args, **kwargs):
        return City.objects.all()

    def resolve_get_districts_in_city(root, info, city_id, *args, **kwargs):
        return District.objects.filter(city__id=city_id)

    def resolve_get_wards_in_district(root, info, district_id, *args, **kwargs):
        return Ward.objects.filter(district__id=district_id)