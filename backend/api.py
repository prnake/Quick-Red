import requests
import json
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from secoder.settings import BASE_DIR
from video.models import Video
from kuaishou_user.models import KuaishouUser
from notice.models import Notification
import datetime
from rest_framework.authentication import SessionAuthentication
import os
import jieba.analyse
from string import digits
import logging
logging.basicConfig(level = logging.INFO, filename="log.txt", filemode="a+", format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CONFIG_PATH = BASE_DIR / "config/production.json"


class UnsafeSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        http_request = request._request
        user = getattr(http_request, 'user', None)

        if not user or not user.is_active:
            return None
        return user, None


def load_config():
    if os.path.isfile(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.loads(f.read())
    else:
        return {
            "app_id": "ks1",
            "app_secret": "1",
            "redirection_uri":
            "http://localhost:8000/api/kuaishou/handle-code",
            "refresh_time": 60,
            "renew_time": 30,
            "salt": "pass",
            "admin": "liziang"
        }


def create_param(name="name",
                 description="",
                 ttype=openapi.TYPE_STRING,
                 method=openapi.IN_QUERY):
    return openapi.Parameter(name, method, description=description, type=ttype)


def save_tag(video):
    remove_digits = str.maketrans('', '', digits)
    tags = video.caption.translate(remove_digits)
    tags = jieba.analyse.extract_tags(tags, topK=3)
    if tags is not None:
        video.tags = json.dumps(tags,ensure_ascii=False)
    else:
        video.tags = "[]"
    video.save()


def create_videos_for_user(access_token, user, videos_list=None):
    try:
        if not videos_list:
            videos_list = get_videos_list(access_token)
        for video in videos_list:
            if video["caption"] == "":
                video["caption"] = "无标题"
            vl = Video.objects.filter(photo_id=video["photo_id"])
            if len(vl) == 0:
                try:
                    v = Video(photo_id=video["photo_id"],
                              caption=video["caption"],
                              cover=video["cover"],
                              play_url=video["play_url"],
                              create_time=datetime.datetime.fromtimestamp(
                                  int(video["create_time"]) / 1000,
                                  tz=datetime.timezone(
                                      datetime.timedelta(hours=8))),
                              kuaishou_user=user)
                    v.update_time = '["{}"]'.format(datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S'))
                    v.likes = "[{}]".format(video["like_count"])
                    v.views = "[{}]".format(video["view_count"])
                    v.comments = "[{}]".format(video["comment_count"])
                    save_tag(v)
                    v.save()
                except Exception as e:
                    logger.error(e)
            else:
                vl[0].kuaishou_user = user
                vl[0].save()
    except Exception as e:
        logger.error(e)


def refresh_access_token(refresh_token, grant_type="refresh_token"):
    # need to refresh both access_token and refresh_token after this function
    config = load_config()
    app_id, app_secret = config['app_id'], config['app_secret']
    url = "https://open.kuaishou.com/oauth2/refresh_token"  # kuaishou api url
    params = {
        "app_id": app_id,
        "app_secret": app_secret,
        "refresh_token": refresh_token,
        "grant_type": grant_type,
    }
    reply = json.loads(requests.get(url, params).content)
    if reply["result"] == 1:
        return {
            "access_token": reply["access_token"],
            "refresh_token": reply["refresh_token"]
        }
    else:
        return None


def get_videos_list(access_token, count=100000):
    config = load_config()
    app_id = config["app_id"]
    #url = "https://open.kuaishou.com/openapi//photo/list"
    url ="https://open.kuaishou.com/openapi/tsinghua/photo/list"
    params = {"access_token": access_token, "app_id": app_id, "count": count}
    byte_reply = requests.get(url, params).content
    reply = json.loads(byte_reply)
    if reply["result"] == 1:
        videos_list = reply['video_list']
        return videos_list
    else:
        return None


def refresh_videos_features(access_token, photo_id):
    config = load_config()
    app_id = config["app_id"]
    #url = "https://open.kuaishou.com/openapi/photo/info"
    url = "https://open.kuaishou.com/openapi/tsinghua/photo/info"
    params = {
        "access_token": access_token,
        "app_id": app_id,
        "photo_id": photo_id
    }
    byte_reply = requests.get(url, params).content
    reply = json.loads(byte_reply)
    if reply["result"] == 1:
        video_info = reply['video_info']
        return {
            "like_count": video_info["like_count"],
            "comment_count": video_info["comment_count"],
            "view_count": video_info["view_count"]
        }
    else:
        return None


def get_user_info(access_token):
    config = load_config()
    app_id = config["app_id"]
    url = "https://open.kuaishou.com/openapi/user_info"
    params = {"access_token": access_token, "app_id": app_id}
    byte_reply = requests.get(url, params).content
    reply = json.loads(byte_reply)
    if reply["result"] == 1:
        user_info = reply['user_info']
        return user_info
    else:
        return None


def get_video_count(access_token, videos_list=None):
    if not videos_list:
        videos_list = get_videos_list(access_token)
    # save videos in database
    if not videos_list:
        return {
            "works": 0,
            "likes": 0,
            "comments": 0,
            "plays": 0
        }
    videos_count = {
        "works": len(videos_list),
        "likes": sum((int(i["like_count"]) for i in videos_list)),
        "comments": sum(
            (int(i["comment_count"]) for i in videos_list)),
        "plays": sum((int(i["view_count"]) for i in videos_list))
    }
    return videos_count


def add_notification(user: KuaishouUser, message: str, title: str, important: bool = False):
    if important:
        title = "[!]" + title
    else:
        title = "[-]" + title
    message = Notification(message=message, title=title, user=user)
    message.save()


def mark_notification_read(notification: Notification):
    notification.read = True
    notification.save()


def check_admin_name(user_name):
    config = load_config()
    admin = config["admin"]
    return admin == user_name


def check_and_notice(user: KuaishouUser, name: str, l: list, new_value, video_name=None):
    if len(l) == 0:
        return
    last_item = l[-1]
    if last_item == 0:
        return
    if (new_value - last_item)/last_item > 0.1:
        if not video_name:
            add_notification(user, "恭喜！ 你的视频总{}数在过去的一小时中增加了超过10%！".format(name), "congratulations")
        else:
            add_notification(user, "恭喜！ 你的视频\"{}\"的总{}数在过去的一小时中增加了超过10%！".format(video_name, name), "congratulations")


def videos_list_to_dict(videos_list: list):
    videos_dict = {}
    for item in videos_list:
        videos_dict[item["photo_id"]] = item
    return videos_dict
