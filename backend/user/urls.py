from django.urls import path
from . import views

urlpatterns = [
    path('login', views.LogIn.as_view(), name='LogIn'),
    path('register', views.Register.as_view(), name='Register'),
    path('logout/', views.Logout.as_view(), name='LogOut'),

]