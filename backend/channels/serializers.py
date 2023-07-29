from rest_framework import serializers

from .models import Channel, ChannelSubscribers
from videos.models import VideoViews, Video

class ChannelsSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Channel
        fields = ['id',  'avatar', 'name', 'verified']
 
class ChannelSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    count_views = serializers.SerializerMethodField()
    count_videos = serializers.SerializerMethodField()
    user_subscribed = serializers.SerializerMethodField()
    subscribers = serializers.SerializerMethodField()

    class Meta:
        model = Channel
        fields = ['id', 'banner', 'avatar', 'name','description', 'verified', 'count_views', 'count_videos', 'subscribers', 'user_subscribed', 'created_at']

    def get_created_at(self, obj):
        return obj.date
    
    def get_count_views(self, obj):
        return VideoViews.objects.filter(channel_id=obj.id).count()
    
    def get_count_videos(self, obj):
        return Video.objects.filter(channel_id=obj.id).count()
    
    def get_user_subscribed(self, obj):
        if self.context['user_id']: 
            return ChannelSubscribers.objects.filter(channel_id=obj.id, user_id=self.context['user_id']).exists()
        
        return False
    
    def get_subscribers(self, obj):
        return ChannelSubscribers.objects.filter(channel_id=obj.id).count()