from .base import Base

from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from channels.models import ChannelSubscribers

from videos.models import Video, VideoViews, VideoLikes, VideoDislikes
from videos.serializers import VideosSerializer, VideoSerializer
from videos.utils.exceptions import VideoNotFound, APIException

class VideosView(Base):
    permission_classes = [AllowAny]
        
    def get(self, request):
        query_channel_id = request.query_params.get('channel_id')

        query = {
            'deleted': False
        }

        if query_channel_id: query['channel_id'] = query_channel_id

        videos = Video.objects.filter(**query).all()
        serializer = VideosSerializer(videos, many=True, context={'user_id': request.user.id})

        return Response({"data": serializer.data})

class VideoView(Base):
    permission_classes = [AllowAny]
        
    def get(self, request, id):
        video = Video.objects.filter(id=id, deleted=False).first()
        if not video:
            raise VideoNotFound

        serializer = VideoSerializer(video, context={'user_id': request.user.id})

        return Response(serializer.data)
    
class VideoViewsApiView(Base):
    def post(self, request, video_id): 
        seconds = request.data.get('seconds', 0) 

        video = Video.objects.values('channel_id').filter(id=video_id, deleted=False).first()
        if not video:
            raise VideoNotFound
        
        check_video_view = VideoViews.objects.filter(video_id=video_id, user_id=request.user.id).exists()
        if check_video_view:
            VideoViews.objects.filter(video_id=video_id, user_id=request.user.id).update( 
                video_time=seconds,
            )
        else: 
            VideoViews.objects.create( 
                video_time=seconds,
                user_id=request.user.id,
                video_id=video_id,
                channel_id=video['channel_id']
            )
 
        return Response({"success": True})
    
class VideoRateLikeView(Base):
    def post(self, request, video_id):
        self.video_exists(video_id)

        check_like = VideoLikes.objects.filter(user_id=request.user.id, video_id=video_id)

        if check_like.exists():
            check_like.delete()
        else:
            VideoLikes.objects.create(user_id=request.user.id, video_id=video_id)

        return Response({"success": True})
    
class VideoRateDislikeView(Base):
    def post(self, request, video_id):
        self.video_exists(video_id)

        check_dislike = VideoDislikes.objects.filter(user_id=request.user.id, video_id=video_id)

        if check_dislike.exists():
            check_dislike.delete()
        else:
            VideoDislikes.objects.create(user_id=request.user.id, video_id=video_id)

        return Response({"success": True})
    

class VideoLikesView(Base): 
    def get(self, request):
        videos = []
        likes = VideoLikes.objects.filter(user_id=request.user.id).all()

        for video_item in likes:
            videos.append(video_item.video)

        serializer = VideosSerializer(videos, many=True, context={'user_id': request.user.id})

        return Response({"data": serializer.data})
    
class VideoDislikesView(Base): 
    def get(self, request):
        videos = []
        dislikes = VideoDislikes.objects.filter(user_id=request.user.id).all()

        for video_item in dislikes:
            videos.append(video_item.video)

        serializer = VideosSerializer(videos, many=True, context={'user_id': request.user.id})

        return Response({"data": serializer.data})
    
class VideoHistoryView(Base): 
    def get(self, request):
        videos = []
        history = VideoViews.objects.filter(user_id=request.user.id).all()

        for video_item in history:
            videos.append(video_item.video)

        serializer = VideosSerializer(videos, many=True, context={'user_id': request.user.id})

        return Response({"data": serializer.data})
     