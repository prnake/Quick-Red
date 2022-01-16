from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.decorators import action
# Create your views here.


class Ping(APIView):
    @staticmethod
    def get(request):
        """
        测试接口，返回pong
        """
        return JsonResponse({
            "code": 200,
            "message": "pong"
        })

    def post(self, request):
        """
        测试接口，返回pong
        """
        return self.get(request)
