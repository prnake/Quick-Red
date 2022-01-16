from django.db import models
from kuaishou_user.models import KuaishouUser

# Create your models here.


class Video(models.Model):
    photo_id = models.CharField(max_length=100, primary_key=True)
    cover = models.URLField(max_length=500, default="cover.jpg")
    caption = models.CharField(max_length=500)
    play_url = models.URLField(max_length=2000, default="play_url")
    create_time = models.DateTimeField()

    # time relative
    update_time = models.TextField(default="[0]")
    likes = models.TextField(default="[0]")
    views = models.TextField(default="[0]")
    comments = models.TextField(default="[0]")

    tags = models.CharField(max_length=5000, default="[]")
    kuaishou_user = models.ForeignKey(KuaishouUser, on_delete=models.CASCADE)