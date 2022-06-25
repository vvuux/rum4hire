from storages.backends.s3boto3 import S3Boto3Storage

from rum4hire_server.settings import AWS_STORAGE_BUCKET_NAME


class HouseImageStorage(S3Boto3Storage):
    bucket_name = AWS_STORAGE_BUCKET_NAME