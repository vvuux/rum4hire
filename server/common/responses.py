from django.http.response import JsonResponse


class SuccessReponse(JsonResponse):
    def __init__(self, data):
        status = 200
        data = {
            "success": True,
            "errors": None,
            "data": data
        }
        super().__init__(data=data, status=status)
        


class ErrorsResponse(JsonResponse):
    def __init__(self, status, errors: dict):
        data = {
            "success": False,
            "errors": errors
        }
        super().__init__(data=data, status=status)
        


class InternalServerErrorsResponse(JsonResponse):
    def __init__(self):
        
        status = 500
        data = {
            "errors": "Internal Server Errors" 
        }
        super().__init__(data=data, status=status)