from rest_framework.views import APIView

from videos.utils.exceptions import VideoNotFound
from videos.models import Video

class Base(APIView):
    def video_exists(self, id):
        video = Video.objects.filter(id=id, deleted=False).first()
        if not video:
            raise VideoNotFound