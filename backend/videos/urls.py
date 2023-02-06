from django.urls import path

from .views.videos import VideosView, VideoView, VideoViewsApiView, VideoRateLikeView, VideoRateDislikeView, VideoLikesView, VideoDislikesView, VideoHistoryView
from .views.comments import CommentsView

urlpatterns = [
   path('', VideosView.as_view()), 
   path('<int:id>', VideoView.as_view()),
   path('<int:video_id>/views', VideoViewsApiView.as_view()),
   path('<int:video_id>/rate/like', VideoRateLikeView.as_view()),
   path('<int:video_id>/rate/dislike', VideoRateDislikeView.as_view()), 
   path('<int:video_id>/comments', CommentsView.as_view()),
   path('likes', VideoLikesView.as_view()),
   path('dislikes', VideoDislikesView.as_view()),
   path('history', VideoHistoryView.as_view()),
]