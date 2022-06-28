import graphene

class OutPut(graphene.Mutation):
    success = graphene.Boolean()
    errors = graphene.JSONString()
    data = graphene.JSONString()

    def mutate(root, info, *args, **kwargs):
        pass