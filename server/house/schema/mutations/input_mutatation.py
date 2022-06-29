import graphene

class CreateHouseInput(graphene.InputObjectType):
    name = graphene.String()
    city_id = graphene.Int()
    district_id = graphene.Int()
    ward_id = graphene.Int()
    address = graphene.String()
    number_of_floor = graphene.Int()
    area = graphene.Float()
    description = graphene.String()


class UpdateHouseInput(graphene.InputObjectType):
    name = graphene.String(required=False)
    city_id = graphene.Int(required=False)
    district_id = graphene.Int(required=False)
    ward_id = graphene.Int(required=False)
    address = graphene.String(required=False)
    number_of_floor = graphene.Int(required=False)
    area = graphene.Float(required=False)
    description = graphene.String(required=False)