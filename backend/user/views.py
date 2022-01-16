import requests
from django.shortcuts import render
from django.contrib.auth.models import auth
# from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from api import create_param, UnsafeSessionAuthentication
from api import load_config
import json
import hashlib
# Create your views here.


def secrete(password):
    config = load_config()
    hash1 = hashlib.sha256(password.encode('utf-8')).hexdigest()
    hash2 = hashlib.sha256(
        (hash1 + config["salt"]).encode('utf-8')).hexdigest()
    return hash2


def get_user_info(app_id, access_token):
    url = "https://open.kuaishou.com/openapi/user_info"
    params = {"access_token": access_token, "app_id": app_id}
    byte_reply = requests.get(url, params).content
    reply = json.loads(byte_reply)
    if reply["result"] == 1:
        user_info = reply['user_info']
        return user_info
    else:
        return []


class LogIn(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[create_param("username", "username of user"),
                                            create_param("password", "password of user")],
                         responses={200: "success", 400: "username duplicate"}
                         )
    def post(request):
        """
        前端在post中包含用户名和密码，后端验证通过后登录用户并将session_id在cookie中返回
        """
        r = request.body
        data = json.loads(r)
        try:
            username = data['username']
            password = secrete(data['password'])
        except KeyError:
            return JsonResponse({
                'code': 400,
                'message': 'no username or password'
            })
        user = authenticate(username=username, password=password)
        if user is not None:
            request.session["username"] = username
            login(request, user)
            return JsonResponse({"code": 200, "message": "login successfully", "data": {"token": 123456}})
        else:
            return JsonResponse({
                "code": 400,
                "message": "wrong username/password"
            })


class Register(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[create_param("username", "username of user"),
                                            create_param("password", "password of user")],
                         responses={200: "success", 400: "username duplicate"}
                         )
    def post(request):
        """
        前端在post中发送用户的用户名和密码，后端进行注册，如果用户已存在返回错误信息
        """
        r = request.body
        data = json.loads(r)
        try:
            username = data['username']
            password = secrete(data['password'])
        except KeyError:
            return JsonResponse({
                'code': 400,
                'message': 'no username or password'
            })
        if_username_exist = len(User.objects.filter(username=username))
        if if_username_exist == 1:
            return JsonResponse({
                "code": 400,
                "message": "username already exists"
            })
        else:
            new_user = User.objects.create_user(username=username,
                                                password=password)
            new_user.save()
            request.session["username"] = username
            return JsonResponse({
                "code": 200,
                "message": "username successfully created",
                "data": {
                    "token": 123456
                }
            })


class Logout(APIView):
    @staticmethod
    @swagger_auto_schema(manual_parameters=[],
                         responses={200: "success"}
                         )
    def get(request):
        """
        前端发送登出请求，后端进行用户登出
        """
        auth.logout(request)
        if "username" in request.session:
            del request.session["username"]
        return JsonResponse({"code": 200, "message": "success"})
