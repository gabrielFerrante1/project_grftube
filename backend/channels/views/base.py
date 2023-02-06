from rest_framework.views import APIView

from channels.models import Channel
from channels.utils import exceptions

class Base(APIView):
    def channel_exists(self, channel_id: int):
        if not Channel.objects.filter(id=channel_id, banned=False).exists():
            raise exceptions.ChannelNotFound()