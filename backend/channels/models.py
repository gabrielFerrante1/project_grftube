from django.db import models
from accounts.models import User
 
class Channel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    avatar = models.TextField()
    banner = models.TextField()
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    verified = models.BooleanField(default=False)
    banned = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "channels"

class ChannelSubscribers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "subscribers"

