from django.conf import settings
from django.forms import ValidationError

from common.forms import UploadImageForm
from house.models import House, HouseImage
from common.responses import SuccessReponse, ErrorsResponse, InternalServerErrorsResponse

from time import time
def timer(func):
    def inner(request):
        start = time()
        resp = func(request)
        end = time()
        print("Time:", end-start)
        return resp
    return inner


@timer
def upload_images(request):
    if request.method == "POST":
        try:
            uuid = request.POST.get("uuid")
            house = House.objects.get(uuid=uuid)
            upload_images_form = UploadImageForm(request.POST, request.FILES)
            
            if upload_images_form.is_valid():
                
                main_image = request.FILES.get("main_image")
                detail_images = request.FILES.getlist("detail_images")

                if len(detail_images) > settings.MAXIMUM_IMAGE_ACTIVE:
                    house.delete()
                    return ErrorsResponse(
                        status=400,
                        errors={
                            "errors": "Number of details image uploaded must equal or lesser than 10"
                        }
                    )
                else:
                    image_list = []

                    main_image = HouseImage(
                        image=main_image,
                        main_image=True,
                        house=house
                    )
                    image_list.append(main_image)

                    image_list.extend([HouseImage(image=image, house=house) for image in detail_images])

                     
                    for image in image_list:
                        image.save()

                    # bulk create occurs long time error ????
                    # HouseImage.objects.bulk_create(image_list)
                    # House.update_images(house=house, main_image=True)
                    # House.update_images(house=house, main_image=False)

                    return SuccessReponse(data=None)

            else:
                house.delete()
                return ErrorsResponse(
                    status=400,
                    errors=upload_images_form.errors
                )

        except House.DoesNotExist:
            return ErrorsResponse(
                status=400,
                errors={
                    "errors": f"House {uuid} does not exist"
                }
            )       
        
        except ValidationError as e:
            return ErrorsResponse(
                status=400,
                errors={
                    "errors": f"{e}"
                }
            )

        except Exception as e:
            return InternalServerErrorsResponse()