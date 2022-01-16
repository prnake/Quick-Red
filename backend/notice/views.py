from django.shortcuts import render, redirect
from django.http import JsonResponse
from api import create_param
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from .models import KuaishouUser, Notification
from django.contrib.auth.models import User
import json
import requests
from api import load_config, get_video_count, get_user_info, create_videos_for_user
import datetime
import pytz
from video.models import Video
from api import UnsafeSessionAuthentication, add_notification, check_admin_name, logger
from kuaishou_user.ignore_views import code_202
# Create your views here.


def code_401():
    return JsonResponse({"code": 401, "message": "login first"})


class Notice(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(responses={200: "notice list", 202: "wrong userid", 401: "auth failed"}
                         )
    def post(request):
        """
        返回未读的notice
        """
        if "username" in request.session:
            username = request.session.get("username")
        else:
            return code_401()
        users = KuaishouUser.objects.filter(username=username)
        if len(users) == 0:
            return code_202(username)
        else:
            user: KuaishouUser = users[0]
            notices = user.notification_set.all()
            notice_list = [{"title": n.title, "message": n.message, "id": n.id, "create_time": datetime.datetime.strftime(
                n.create_time + datetime.timedelta(hours=8), '%Y-%m-%d %H:%M:%S')} for n in notices if not n.read]
            return JsonResponse({
                "code": 200,
                "notices": notice_list
            })


class AllNotice(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(responses={200: "notice list", 202: "wrong userid", 401: "auth failed"}
                         )
    def post(request):
        """
        返回所有的notice
        """
        print(request.session.keys())
        if "username" in request.session:
            username = request.session.get("username")
        else:
            return code_401()
        users = KuaishouUser.objects.filter(username=username)
        if len(users) == 0:
            return code_202(username)
        else:
            user: KuaishouUser = users[0]
            notices = user.notification_set.all()
            notice_list = [{"title": n.title, "message": n.message, "read": n.read, "id": n.id, "create_time": datetime.datetime.strftime(
                n.create_time + datetime.timedelta(hours=8), '%Y-%m-%d %H:%M:%S')} for n in notices]
            return JsonResponse({
                "code": 200,
                "notices": notice_list
            })


class AddNotice(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(responses={200: "add notice successfully", 400: "no auth"}
                         )
    def post(request):
        """
        管理员给用户添加notice
        """
        if "username" not in request.session:
            return code_401()
        username = request.session.get("username")
        if not check_admin_name(username):
            return JsonResponse({
                "code": 400,
                "message": "you have no authority to send notices"
            })
        r = request.body
        data = json.loads(r)
        users = KuaishouUser.objects.all()
        for user in users:
            for notification in data:
                add_notification(
                    user, notification["message"], notification["title"])
        return JsonResponse({
            "code": 200,
            "message": "add notice successfully"
        })


class MarkRead(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(responses={200: "mark successfully", 400: "json decode error", 401: "auth failed"}
                         )
    def post(request):
        """
        用户标记notice为已读
        """
        if "username" in request.session:
            username = request.session.get("username")
        else:
            return code_401()
        users = KuaishouUser.objects.filter(username=username)
        if len(users) == 0:
            return code_202(username)
        try:
            r = request.body
            data = json.loads(r)
        except json.JSONDecodeError:
            return JsonResponse({"code": 400, "message": "json decode error"})
        notice_id = data["id"]
        user: KuaishouUser = users[0]
        notices = user.notification_set.filter(id=notice_id)
        for notice in notices:
            notice.read = True
            notice.save()
        return JsonResponse({"code": 200, "message": "mark successfully"})
