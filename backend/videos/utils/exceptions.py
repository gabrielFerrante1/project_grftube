from rest_framework.exceptions import APIException

class VideoNotFound(APIException):
    status_code = 404
    default_code = 'video_not_found'
    default_detail = 'Este vídeo não foi encontrado'