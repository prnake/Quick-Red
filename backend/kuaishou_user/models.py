from django.db import models

# Create your models here.


class KuaishouUser(models.Model):
    username = models.CharField(max_length=500, primary_key=True)
    nickname = models.CharField(max_length=500, default="")
    open_id = models.CharField(max_length=500, default="")
    authorized = models.BooleanField(default=False)
    head = models.URLField(max_length=500, default="avatar.jpg")
    big_head = models.URLField(max_length=500, default="big_avatar.jpg")

    # time relative
    update_time = models.TextField(default="[\"0\"]")
    videos_count = models.TextField(default="[0]")
    likes_count = models.TextField(default="[0]")
    comments_count = models.TextField(default="[0]")
    views_count = models.TextField(default="[0]")

    code = models.CharField(max_length=500)
    refresh_token = models.TextField()
    access_token = models.TextField()
