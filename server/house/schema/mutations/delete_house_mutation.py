import graphene
from graphql_jwt.decorators import login_required

from common.schema.output_mutation import OutPut
from house.models import House


class DeleteHouseMutation(OutPut):
    class Arguments:
        uuid = graphene.String()

    @login_required
    def mutate(root, info, *args, **kwargs):
        try:
            user = info.context.user
            success = False
            errors = None

            try:
                house = user.houses.get(uuid=kwargs["uuid"])
                house.soft_delete()

                success = True
            except House.DoesNotExist:
                errors = {"errors": f"You don\'t have permission to request or house {kwargs['uuid']} doesn\'t exists" }

            return DeleteHouseMutation(
                success=success,
                errors=errors
            )
        
        except Exception as e:
            pass
