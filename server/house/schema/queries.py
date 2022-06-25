import graphene
from graphql_jwt.decorators import login_required

from house.schema.types import HouseType
from house.models import House


class Query(graphene.ObjectType):
    get_my_house = graphene.List(HouseType)
    get_house_details = graphene.Field(HouseType, id=graphene.String())
    get_houses_by_name = graphene.List(HouseType, name=graphene.String())


    @login_required
    def resolve_get_my_house(root, info, *args, **kwargs):
        return House.objects.filter(owner=info.context.user)\
            .prefetch_related("city")\
                .prefetch_related("district")\
                    .prefetch_related("ward")

    @login_required
    def resolve_get_house_details(root, info, id, *args, **kwargs):
        try:
            return House.objects.get(owner=info.context.user, id=id)
        except House.DoesNotExist:
            return House.objects.none()

    @login_required
    def resolve_get_houses_by_name(root, info, name, *args, **kwargs):    
        return House.objects.filter(
            owner=info.context.user, 
            name__icontains=name
        )
    
    