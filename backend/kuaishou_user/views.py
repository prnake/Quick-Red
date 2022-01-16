from django.shortcuts import render, redirect
from django.http import JsonResponse
from api import create_param
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from .models import KuaishouUser
from django.contrib.auth.models import User
import json
import requests
from api import load_config, get_video_count, get_user_info, create_videos_for_user
import datetime
import pytz
from video.models import Video
from api import UnsafeSessionAuthentication, add_notification
from .ignore_views import code_202
# Create your views here.


class Url(APIView):
    @staticmethod
    @swagger_auto_schema(manual_parameters=[],
                        responses={200: "redirect url"}
    )
    def get(request):
        """
        返回用戶授权登录快手的URL
        """
        if "username" in request.session:
            state = request.session.get("username")
        else:
            return JsonResponse({"code": 401, "message": "login first"})
        config = load_config()
        return JsonResponse({
            "code":
            200,
            "message":
            "https://open.kuaishou.com/oauth2/authorize?app_id={"
            "}&scope=user_info&response_type=code&ua=pc&redirect_uri={}&state={}"
            .format(config['app_id'], config["redirection_uri"], state)
        })
