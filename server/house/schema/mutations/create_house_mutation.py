from graphql_jwt.decorators import login_required

from .input_mutatation import HouseInput
from common.schema.output_mutation import OutPut
from house.models import House
from house.forms.house_form import HouseForm


class CreateHouseMutation(OutPut):
    class Arguments:
        data = HouseInput(required=True)

    @login_required
    def mutate(root, info, *args, **kwargs):
        try:
            user = info.context.user
            success=False
            data=None

            create_house_form = HouseForm(data=kwargs["data"])

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