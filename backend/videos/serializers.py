from rest_framework import serializers

from videos.models import Video, VideoViews, VideoTags, VideoLikes, VideoDislikes, VideoComments

from channels.models import ChannelSubscribers

class VideosSerializer(serializers.ModelSerializer):
    channel = serializers.SerializerMethodField()
    minutes_viewed = serializers.SerializerMethodField()
    views = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['id', 'title', 'thumbnail', 'minutes', 'date', 'channel', 'minutes_viewed', 'views']

    def get_channel(self, obj):
        return get_channel(obj)
    
    def get_minutes_viewed(self, obj):  
        return get_minutes_viewed(self, obj)
    
    def get_views(self, obj):
        return VideoViews.objects.filter(video_id=obj.id).count()
    

class VideoSerializer(serializers.ModelSerializer):
    channel = serializers.SerializerMethodField()
    user_viewed = serializers.SerializerMethodField()
    user_subscribed = serializers.SerializerMethodField()
    user_rate = serializers.SerializerMethodField()
    views = serializers.SerializerMethodField() 
    likes = serializers.SerializerMethodField() 
    tags = serializers.SerializerMethodField() 

    class Meta:
        model = Video
        fields = ['id', 'title', 'src', 'description', 'comments_area', 'thumbnail', 'minutes', 'date', 'channel', 'user_viewed', 'user_subscribed', 'user_rate', 'views', 'likes', 'tags']

    def get_channel(self, obj): 
        return {
        'id': obj.channel.id,
        'name': obj.channel.name,
        'avatar': obj.channel.avatar,
        'verified': obj.channel.verified,
        'subscribers': ChannelSubscribers.objects.filter(channel_id=obj.channel.id).count()
    }
    
    def get_user_viewed(self, obj): 
        return { "minutes": get_minutes_viewed(self, obj) }

    def get_user_subscribed(self, obj):
        if self.context['user_id']: 
            return ChannelSubscribers.objects.filter(channel_id=obj.channel.id, user_id=self.context['user_id']).exists()
        
        return False
    
    def get_user_rate(self, obj):
        if self.context['user_id']:
            if VideoLikes.objects.filter(video_id=obj.id, user_id=self.context['user_id']).exists():
                return 'like'
            
            if VideoDislikes.objects.filter(video_id=obj.id, user_id=self.context['user_id']).exists():
                return 'dislike'
        return ''

    def get_views(self, obj):
        return VideoViews.objects.filter(video_id=obj.id).count()
    
    def get_likes(self, obj):
        return VideoLikes.objects.filter(video_id=obj.id).count()

    def get_tags(self, obj): 
        tags = VideoTags.objects.values('tag').filter(video_id=obj.id, hidden=False).all()

        tagsList = []
        for i  in tags:
            tagsList.append(i['tag'])

        return tagsList
    

class VideoCommentsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = VideoComments
        fields = ['id', 'body', 'date', 'user']

    def get_user(self, obj):
        return {
            "name": obj.user.name 
        }



# Functions of classes Video
def get_channel(obj):
    return {
        'id': obj.channel.id,
        'name': obj.channel.name,
        'avatar': obj.channel.avatar,
        'verified': obj.channel.verified
    }

def get_minutes_viewed(self, obj):
    minutes = "0"
    if self.context['user_id']:
        video_view = VideoViews.objects.values('video_time').filter(video_id=obj.id, user_id=self.context['user_id']).first()
        
        if video_view: minutes = video_view['video_time']

    return minutes