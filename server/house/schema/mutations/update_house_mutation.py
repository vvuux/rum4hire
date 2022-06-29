import graphene
from graphql_jwt.decorators import login_required

from .input_mutatation import UpdateHouseInput
from common.schema.output_mutation import OutPut
from house.models import House
from house.forms.update_house_form import UpdateHouseForm

class UpdateHouseMutation(OutPut):
    class Arguments:
        uuid = graphene.String()
        data = UpdateHouseInput(required=True)

    @login_required
    def mutate(root, info, *args, **kwargs):
        try:

            user = info.context.user
            house = user.houses.filter(uuid=kwargs["uuid"])
            success = False
            data = None

            if house.exists():

                update_house_form = UpdateHouseForm(kwargs["data"])

                if update_house_form.is_valid():

                    cleaned_data = update_house_form.cleaned_data.copy()
                    
                    # cleaned data return dict include required=False field, so remove it
                    for key in update_house_form.cleaned_data.keys():
                        if key not in kwargs["data"].keys():
                            del cleaned_data[key]
                        
                    house.update(**cleaned_data)

                    success = True
                    errors = None

                else:
                    
                    errors = update_house_form.errors

            else:
            
                errors = {"errors": f"You don\'t have permission to request or house {kwargs['uuid']} doesn\'t exists"}
            
            return UpdateHouseMutation(
                success = success,
                errors = errors,
                data = data
            )
        
        except Exception as e:
            pass
