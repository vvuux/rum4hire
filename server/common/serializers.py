from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder


class ImageEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime("%Y,%d,%m,%H,%M,%S")
        return super().default(obj)