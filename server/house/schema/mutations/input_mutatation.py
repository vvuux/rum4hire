import graphene

class HouseInput(graphene.InputObjectType):
    name = graphene.String()
    city_id = graphene.Int()
    district_id = graphene.Int()
    ward_id = graphene.Int()
    address = graphene.String()
    number_of_floor = graphene.Int()
    area = graphene.Float()
    description = graphene.String()