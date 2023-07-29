from django.urls import path

from .views.channel import ChannelView, ChannelSubscribeView, ChannelsView

urlpatterns = [
    path('', ChannelsView.as_view()),
    path('<int:id>', ChannelView.as_view()),
    path('<int:id>/subscribe', ChannelSubscribeView.as_view()), 
]
