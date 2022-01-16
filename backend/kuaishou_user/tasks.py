import json
import datetime
import django
import pytz

django.setup()

from .ignore_views import secrete_encode, secrete_decode
from kuaishou_user.models import KuaishouUser
from api import logger
from api import refresh_access_token, get_video_count
from api import videos_list_to_dict, get_videos_list
from api import create_videos_for_user, add_notification
from api import check_and_notice, load_config

def refresh():
    users = KuaishouUser.objects.all()
    for user in users:
        if user.authorized:
            new_token = refresh_access_token(secrete_decode(user.refresh_token))
            if not new_token:
                user.authorized = False
                user.save()
            else:
                user.access_token = secrete_encode(new_token["access_token"])
                user.authorized = True
                user.refresh_token = secrete_encode(new_token["refresh_token"])
                user.save()


def renew_info():
    config = load_config()
    users = KuaishouUser.objects.all()
    t = datetime.datetime.now()
    for user in users:
        u = json.loads(user.update_time)
        if len(u) == 1:
            create_videos_for_user(secrete_decode(user.access_token), user)
            renew_user_info(user)
        else:
            last_u_time = datetime.datetime.strptime(u[-1], "%Y-%m-%d %H:%M:%S")
            delta = t - last_u_time
            if delta.seconds >= config["renew_time"]:
                renew_user_info(user)
                renew_video_info(user)


def renew_video_info(user: KuaishouUser):
    now_time = datetime.datetime.now()
    now_time = now_time.replace(tzinfo=pytz.timezone('UTC'))
    if not user.authorized:
        return
    videos_list = get_videos_list(secrete_decode(user.access_token))
    videos_dict = videos_list_to_dict(videos_list)
    if not videos_list:
        user.authorized = False
        add_notification(user, "你的授权已过期，请重新授权", "authorization time out", True)
        return
    if len(videos_list) != user.video_set.all().count():
        for video in user.video_set.all():
            if video.photo_id not in videos_dict:
                video.delete()
        create_videos_for_user(secrete_decode(user.access_token), user, videos_list)
    else:
        for video in user.video_set.all():
            new_data = videos_dict[video.photo_id]
            likes = json.loads(video.likes)
            views = json.loads(video.views)
            comments = json.loads(video.comments)
            update_time = json.loads(video.update_time)
            update_time.append(datetime.datetime.strftime(now_time, '%Y-%m-%d %H:%M:%S'))
            check_and_notice(user, "点赞", likes, new_data["like_count"], video.caption)
            likes.append(new_data["like_count"])
            check_and_notice(user, "播放", views, new_data["view_count"], video.caption)
            views.append(new_data["view_count"])
            check_and_notice(user, "评论", comments, new_data["comment_count"], video.caption)
            comments.append(new_data["comment_count"])
            video.likes = json.dumps(likes)
            video.views = json.dumps(views)
            video.comments = json.dumps(comments)
            video.update_time = json.dumps(update_time)
            video.save()


def renew_user_info(user: KuaishouUser):
    now_time = datetime.datetime.now()
    now_time = now_time.replace(tzinfo=pytz.timezone('UTC'))
    if not user.authorized:
        return
    count = get_video_count(secrete_decode(user.access_token))
    if not count:
        user.authorized = False
        add_notification(user, "your authorization has been timed out, please authorize again",
                         "authorization time out", True)
        return
    update_time = json.loads(user.update_time)
    videos_count = json.loads(user.videos_count)
    likes_count = json.loads(user.likes_count)
    comments_count = json.loads(user.comments_count)
    views_count = json.loads(user.views_count)
    update_time.append(datetime.datetime.strftime(now_time, '%Y-%m-%d %H:%M:%S'))
    check_and_notice(user, "", videos_count, count["works"])
    videos_count.append(count["works"])
    check_and_notice(user, "点赞", likes_count, count["likes"])
    likes_count.append(count["likes"])
    check_and_notice(user, "评论", comments_count, count["comments"])
    comments_count.append(count["comments"])
    check_and_notice(user, "播放", views_count, count["plays"])
    views_count.append(count["plays"])
    user.update_time = json.dumps(update_time)
    user.videos_count = json.dumps(videos_count)
    user.likes_count = json.dumps(likes_count)
    user.comments_count = json.dumps(comments_count)
    user.views_count = json.dumps(views_count)
    user.save()


def daily_report():
    users = KuaishouUser.objects.all()
    for user in users:
        update_time = json.loads(user.update_time)
        videos_count = json.loads(user.videos_count)
        likes_count = json.loads(user.likes_count)
        comments_count = json.loads(user.comments_count)
        views_count = json.loads(user.views_count)
        if len(update_time) > 24:
            video_increase = videos_count[-1] - videos_count[-24]
            likes_increase = likes_count[-1] - likes_count[-24]
            comments_increase = comments_count[-1] - comments_count[-24]
            views_increase = views_count[-1] - views_count[-24]
            add_notification(user, """
            尊敬的{},您好！在过去的一天中，您的视频数量增加了{}，所有视频点赞数增加了{}，评论数增加了{},播放数增加了{}!
            """.format(user.username, video_increase, likes_increase,
                       comments_increase, views_increase), "每日信息统计")
