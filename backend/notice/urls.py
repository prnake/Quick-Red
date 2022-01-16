from django.urls import path
from . import views


urlpatterns = [
    path('unread', views.Notice.as_view(), name="Notice"),
    path('add', views.AddNotice.as_view(), name="AddNotice"),
    path('all', views.AllNotice.as_view(), name="AllNotice"),
    path('markread', views.MarkRead.as_view(), name="MarkRead")
]