from django.db import models
from channels.models import Channel
from accounts.models import User

# Create your models here.

class Video(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    thumbnail = models.TextField(null=True)
    src = models.TextField()
    minutes = models.CharField(max_length=10)
    description = models.TextField(null=True)
    comments_area = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "videos"

class VideoTags(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    tag = models.CharField(max_length=80)
    hidden = models.BooleanField(default=False)  

    class Meta:
        db_table = "video_tags"

class VideoLikes(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "video_likes"

class VideoDislikes(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "video_dislikes"


class VideoComments(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    body = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "video_comments"

class VideoViews(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE) 
    video_time = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "video_views" 