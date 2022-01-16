from django.urls import path

from . import views, ignore_views

urlpatterns = [
    path('url/', views.Url.as_view(), name='kuaishou_login_url'),
    path('handle-code/', ignore_views.HandleCode.as_view(), name='handle_code'),
    path('user/', ignore_views.Info.as_view(), name='Info'),
    path('videolist', ignore_views.VideoList.as_view(), name='VideoList'),
    path('hometf', ignore_views.HomeTF.as_view(), name='HomeTF'),
    path('vdata', ignore_views.VData.as_view(), name="VData"),
    path('settags', ignore_views.Tags.as_view(), name="Tag"),
    path('resettags/', ignore_views.ResetTags.as_view(), name="Tag"),
]
