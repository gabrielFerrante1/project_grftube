from rest_framework.exceptions import APIException

class ChannelNotFound(APIException):
    status_code = 404
    default_code = 'channel_not_found'
    default_detail = 'Este canal não foi encontrado'