from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import APIException

from videos.views.base import Base
from videos.models import VideoComments
from videos.serializers import VideoCommentsSerializer

class CommentsView(Base):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, video_id):
        self.video_exists(video_id)

        comments = VideoComments.objects.filter(video_id=video_id)

        check_user_commented = False
        if request.user: check_user_commented = VideoComments.objects.filter(video_id=video_id, user_id=request.user.id ).exists()

        serializer = VideoCommentsSerializer(comments, many=True)

        return Response({
            "comments": serializer.data,
            "commentsCount": comments.count(),
            "userCommented": check_user_commented
            })
    
    def post(self, request, video_id):
        self.video_exists(video_id)

        body = request.data.get('body')

        if not body:
            raise APIException("Envie os paramêtros necessários", "validators_errors")
        
        comment = VideoComments.objects.create(
            body=body,
            user_id=request.user.id,
            video_id=video_id
        )

        serializer = VideoCommentsSerializer(comment)

        return Response({
             "comment":  serializer.data
            })