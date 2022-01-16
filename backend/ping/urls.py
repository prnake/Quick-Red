from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.Ping.as_view(), name='ping'),
]