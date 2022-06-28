import graphene

from .create_house_mutation import CreateHouseMutation


class Mutation(graphene.ObjectType):
    create_house = CreateHouseMutation.Field()
