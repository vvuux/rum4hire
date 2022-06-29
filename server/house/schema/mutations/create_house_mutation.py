from graphql_jwt.decorators import login_required

from .input_mutatation import CreateHouseInput
from common.schema.output_mutation import OutPut
from house.models import House
from house.forms.create_house_form import CreateHouseForm


class CreateHouseMutation(OutPut):
    class Arguments:
        data = CreateHouseInput(required=True)

    @login_required
    def mutate(root, info, *args, **kwargs):
        try:
            user = info.context.user
            success=False
            data=None

            create_house_form = CreateHouseForm(data=kwargs["data"])

            if create_house_form.is_valid():
                create_house_form.cleaned_data["owner"] = user

                house = House.objects.create(**create_house_form.cleaned_data)

                success = True
                errors = None
                data = {
                    'uuid': str(house.uuid)
                }
            
            else:
                errors = create_house_form.errors

            return CreateHouseMutation(
                success=success,
                errors=errors,
                data=data
            )
        except Exception as e:
            pass