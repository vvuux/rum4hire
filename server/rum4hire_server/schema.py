import graphene

from user import schema as user_schema
from common import schema as common_schema
from house import schema as house_schema

class Query(
    user_schema.Query,
    common_schema.Query,
    house_schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    user_schema.Mutation, 
    graphene.ObjectType
):
    pass

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)