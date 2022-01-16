from django.db import models
from kuaishou_user.models import KuaishouUser


# Create your models here.
class Notification(models.Model):
    message = models.TextField(default="")
    title = models.TextField(default="")
    read = models.BooleanField(default=False)
    create_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(KuaishouUser, on_delete=models.CASCADE)