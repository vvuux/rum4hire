import graphene

from .create_house_mutation import CreateHouseMutation
from .update_house_mutation import UpdateHouseMutation

class Mutation(graphene.ObjectType):
    create_house = CreateHouseMutation.Field()
    update_house = UpdateHouseMutation.Field()