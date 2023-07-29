from .base import Base

from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from channels.models import Channel, ChannelSubscribers

from channels.serializers import ChannelSerializer, ChannelsSerializer


class ChannelsView(Base): 
    def get(self, request ):
        channels = []
        channel_ids = ChannelSubscribers.objects.filter(user_id=request.user.id).all()

        for channel_item in channel_ids:
            channels.append(channel_item.channel)

        serializer = ChannelsSerializer(channels, many=True)

        return Response({"data": serializer.data})

class ChannelView(Base):
    permission_classes = [AllowAny]

    def get(self, request, id):
        self.channel_exists(id)

        channel = Channel.objects.filter(id=id).first() 
        serializer = ChannelSerializer(channel, context={'user_id': request.user.id})

        return Response({"data": serializer.data})
    
class ChannelSubscribeView(Base):
    def post(self, request, id):
        self.channel_exists(id)

        subscribe = ChannelSubscribers.objects.filter(user_id=request.user.id, channel_id=id)
        if subscribe.exists():
            subscribe.delete()
        else:
            ChannelSubscribers.objects.update_or_create(
                user_id=request.user.id,
                channel_id=id
            )

        return Response({"success": True})