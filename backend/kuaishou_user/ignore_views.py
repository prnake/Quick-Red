from django.shortcuts import render, redirect
from django.http import JsonResponse
from api import create_param
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from .models import KuaishouUser
import json
import requests
from api import load_config, get_video_count, get_user_info, create_videos_for_user,check_admin_name,save_tag, add_notification
import datetime
from video.models import Video
from api import UnsafeSessionAuthentication
from itsdangerous import JSONWebSignatureSerializer
from django.utils.datastructures import MultiValueDictKeyError
from json.decoder import JSONDecodeError
from api import logger


def check_user(user, username):
    if not user.authorized:
        return code_202(username)
    return None


def get_access_token_and_refresh_token(app_id,
                                       app_secret,
                                       code,
                                       grant_type="authorization_code"):
    url = "https://open.kuaishou.com/oauth2/access_token"  # kuaishou api url
    params = {
        "app_id": app_id,
        "app_secret": app_secret,
        "code": code,
        "grant_type": grant_type,
    }
    byte_reply = requests.get(url, params).content
    reply = json.loads(byte_reply)
    if reply["result"] == 1:
        return {
            "access_token": reply["access_token"],
            "refresh_token": reply["refresh_token"],
            "open_id": reply["open_id"]
        }
    else:
        return None


def secrete_encode(secrete):
    config = load_config()
    secret_key = JSONWebSignatureSerializer("secret-key", salt=config["salt"])
    secrete_code = secret_key.dumps(secrete).decode('utf-8', 'ignore')
    return secrete_code


def secrete_decode(secrete_code):
    config = load_config()
    secret_key = JSONWebSignatureSerializer("secret-key", salt=config["salt"])
    secrete = secret_key.loads(secrete_code).encode('utf-8')
    return secrete


def code_401():
    return JsonResponse({
        'code': 401,
        'message': 'please login first'
    })


def code_202(username):
    config = load_config()
    return JsonResponse({
        "code": 202,
        "data": {
            "username":
            username,
            "authurl":
            "https://open.kuaishou.com/oauth2/authorize?app_id={"
            "}&scope=user_info,user_video_info&response_type=code&ua=pc&redirect_uri={}&state={}"
            .format(config['app_id'], config["redirection_uri"], username)
        }
    })


class Info(APIView):
    @staticmethod
    @swagger_auto_schema(manual_parameters=[create_param("userid", "userid")],
                        responses={200: "redirect url",202:"login url",400:"wrong userid",401:"auth failed"}
    )
    def get(request):
        """
        前端需要提供userid(不过这部分后端暂时不需要)，后端返回user信息
        """
        try:
            if "username" not in request.session:
                return code_401()
            username = request.session.get("username")
            user = KuaishouUser.objects.filter(username=username)

            if len(user) == 0:
                return code_202(username)
            else:
                user = user[0]
                check = check_user(user, username)
                if check:
                    return check

                return JsonResponse({
                    "code": 200,
                    "data": {
                        "username": username,
                        "info": {
                            "name": user.nickname,
                            "avatar": user.head,
                            "details": {
                                "works": json.loads(user.videos_count)[-1],
                                "fans": user.code,
                                "likes": json.loads(user.likes_count)[-1],
                                "comments": json.loads(user.comments_count)[-1],
                                "plays": json.loads(user.views_count)[-1]
                            }
                        }
                    }
                })
        except Exception as e:
            return JsonResponse({"error": str(e)})


class HandleCode(APIView):
    @staticmethod
    @swagger_auto_schema(manual_parameters=[
        create_param("code", "code of user"),
        create_param("state", "username of user to identify")
    ],responses={200: "redirect url",202:"login url",404:"invalid code"})
    def get(request):
        """
        处理快手的回调请求，将用户的code存入数据库
        """
        config = load_config()
        old_user = False
        try:
            code = request.GET["code"]
            state = request.GET["state"]
            token = get_access_token_and_refresh_token(config['app_id'],
                                                       config['app_secret'],
                                                       code)
            open_id = token["open_id"]
            user_by_id = KuaishouUser.objects.filter(open_id=open_id)
            if len(user_by_id) != 0:
                old_user = True
                u = user_by_id[0]
                v = KuaishouUser.objects.filter(username=state)
                if len(v) == 0:
                    return redirect("/#/authedto/{}".format(u.username))
                else:
                    v = v[0]
                    if u.username != v.username:
                        return redirect("/#/authedto/{}".format(u.username))
            try:
                user = KuaishouUser.objects.get(username=state)
            except KuaishouUser.DoesNotExist:
                user = KuaishouUser(username=state)
            user.open_id = open_id
            user.save()

            try:
                user.access_token = secrete_encode(token['access_token'])
                user.authorized = True
                user.refresh_token = secrete_encode(token['refresh_token'])
                user.save()
                if old_user:
                    return redirect("/")
                count = get_video_count(secrete_decode(user.access_token))
                user_info = get_user_info(secrete_decode(user.access_token))

                user.head = user_info["head"]
                user.nickname = user_info["name"]
                user.code = user_info["fan"]
                user.authorized = True
                t = datetime.datetime.now()
                user.update_time = '["{}"]'.format(datetime.datetime.strftime(t, '%Y-%m-%d %H:%M:%S'))
                user.likes_count = "[{}]".format(count["likes"])
                user.videos_count = "[{}]".format(count["works"])
                user.comments_count = "[{}]".format(count["comments"])
                user.views_count = "[{}]".format(count["plays"])
                add_notification(user, "恭喜您成功绑定快手账号！", "恭喜！", True)
                user.save()

            except Exception as e:
                return JsonResponse({'code': 404, 'message': str(e)})
            return redirect('/')
        except Exception as e:
            return JsonResponse({'code': 404, 'message': str(e)})


def video_dynamic(video):
    # dynamic args return dict of the lists
    update_time = video.update_time
    likes = video.likes
    views = video.views
    comments = video.comments
    try:
        update_time = json.loads(update_time)
        likes = json.loads(likes)
        views = json.loads(views)
        comments = json.loads(comments)

        assert type(update_time) == list
        assert type(likes) == list
        assert type(views) == list
        assert type(comments) == list
    except JSONDecodeError:
        print("wrong data type")
    return {
        "update_time": update_time,
        "likes": likes,
        "plays": views,
        "comments": comments
    }


class VideoList(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[
        create_param("userid", "userid"),
        create_param("start_time,", "start time of the list need to be a timestamp"),
        create_param("end_time,", "start time of the list need to be a timestamp"),
    ],
    responses={200: "success",202:"login url",400:"wrong userid",401:"auth failed"})
    def post(request):
        """
        返回当前用户的所有视频信息
        """
        try:
            r = request.body
            data = json.loads(r)
            if "username" not in request.session:
                return code_401()
            username = request.session.get("username")
            user = KuaishouUser.objects.filter(username=username)
            if len(user) == 0:
                return code_202(username)
            else:
                user = user[0]
                check = check_user(user, username)
                if check:
                    return check

                kuaishou_user = KuaishouUser.objects.filter(
                    username=username)[0]
                videos_list = kuaishou_user.video_set.all()
                # save videos in database
                video_items = [{
                    "id": video.photo_id,
                    "title": video.caption if video.caption != "" else "无标题",
                    "pic": video.cover,
                    "pubdate": video.create_time,
                    "play_url": video.play_url,
                    "likes": small_dict["likes"][-1],
                    "comments": small_dict["comments"][-1],
                    "plays": small_dict["plays"][-1],
                    "tags": json.loads(video.tags)
                } for video in videos_list
                               if (small_dict := video_dynamic(video))]
                start_time = datetime.datetime.strptime(data["start_time"], '%Y-%m-%d')
                end_time = datetime.datetime.strptime(data["end_time"], '%Y-%m-%d')
                end_time += datetime.timedelta(days=1)
                # filter
                video_items = [
                    video for video in video_items
                    if (end_time.timestamp() >= video["pubdate"].timestamp() >= start_time.timestamp())
                ]

                total = len(video_items)
                video_items = sorted(video_items,
                                     key=lambda video: video["pubdate"],
                                     reverse=True)

                for video in video_items:
                    video["pubdate"] = datetime.datetime.strftime(video["pubdate"], '%Y-%m-%d %H:%M:%S')

                # need to add tag from data table
                return JsonResponse({
                    "code": 200,
                    "data": {
                            "total": total,
                            "items": video_items
                    }
                })
        except Exception as e:
            return JsonResponse({"error": str(e)})


class HomeTF(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[
    ],responses={200: "success",202:"login url",401:"auth failed"})
    def post(request):
        """
        返回一个列表，包含昨天到今天这个时刻(后端接收到请求)的24个小时时间点
        返回点赞，评论，播放，总活跃度的列表，用24补齐
        """

        def operate(l):
            if len(l) == 0:
                return [0]*24
            if len(l) >= 24:
                fill = l[-24]
            else:
                fill = l[0]
            l = [fill]*24 + l[-24:]
            l = l[-24:]
            return l

        try:
            if "username" not in request.session:
                return code_401()
            username = request.session.get("username")
            user = KuaishouUser.objects.filter(username=username)

            if len(user) == 0:
                return code_202(username)
            else:
                user = user[0]
                check = check_user(user, username)
                if check:
                    return check

                kuaishou_user = KuaishouUser.objects.filter(
                    username=username)[0]
                try:
                    t = datetime.datetime.now()
                    time_array_24h = [None]*24

                    for i in range(23, -1, -1):
                        time_array_24h[23 - i] = t - datetime.timedelta(hours=i)
                    likes = json.loads(kuaishou_user.likes_count)
                    plays = json.loads(kuaishou_user.views_count)
                    comments = json.loads(kuaishou_user.comments_count)

                    update_time = list(map(lambda x: datetime.datetime.strftime(x, '%Y-%m-%d %H:%M:%S'), time_array_24h))
                    likes = operate(likes)
                    plays = operate(plays)
                    comments = operate(comments)
                    all_active = [comments[i] + likes[i] + plays[i] for i in range(24)]
                except Exception as e:
                    print(e)
                    update_time = [datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S')]*24
                    likes = [0]*24
                    plays = [0]*24
                    comments = [0]*24
                    all_active = [0]*24

                return JsonResponse({
                    "code": 200,
                    "data": {
                        "xAxis": update_time,
                        "series": [
                            likes,
                            comments,
                            plays,
                            all_active
                        ]
                    }
                })
        except Exception as e:
            return JsonResponse({"error": str(e)})


class Tags(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)
    @staticmethod
    @swagger_auto_schema(manual_parameters=[create_param("tags", "a list of tags like [\"af\",\"afdasdf\"]"),
    ],responses={200: "success",202:"login url",400:"no video matches",401:"auth failed"})
    def post(request):
        '''
        前端给tag的列表，更改后端
        '''
        try:
            if "username" not in request.session:
                return code_401()
            username = request.session.get("username")
            user = KuaishouUser.objects.filter(username=username)

            if len(user) == 0:
                return code_202(username)
            else:
                user = user[0]
                check = check_user(user, username)
                if check:
                    return check
            username = request.session.get("username")
            r = request.body
            data = json.loads(r)
            tags = data["tags"]
            photo_id=data["photo_id"]
            kuaishou_user = KuaishouUser.objects.filter(username=username)[0]        
            video_list = kuaishou_user.video_set.filter(photo_id=photo_id)
            if len(video_list)==0:
                return JsonResponse({
                'code': 400,
                'message': 'no video matches'
            })
            video=video_list[0]
            video.tags=json.dumps(tags)
            video.save()
            return JsonResponse({
                'code': 200,
                'message': 'set successfully'
            })
        except Exception as e:
            return JsonResponse({"error": str(e)})


class VData(APIView):
    authentication_classes = (UnsafeSessionAuthentication,)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[create_param("id", "data id"),
    ],responses={200: "success",202:"login url",400:"no video matches",401:"auth failed",402:"invalid photo id for user id"})
    def post(request):
        '''
        返回video data
        '''
        def operate(l):
            l = l[::-24]
            fill = l[30] if len(l)>=30 else l[-1]
            l.extend([fill] * 30)
            return l[:30][::-1]

        def operate_24h(l):
            l = l[::-1]
            fill = l[24] if len(l) >= 24 else l[-1]
            l.extend([fill] * 24)
            return l[:24][::-1]

        try:
            r = request.body
            data = json.loads(r)
            photo_id = data["id"]
            counts = None
            count_data = []
            count_24h = []
            caption = ""
            cover = ""
            play_url = ""
            if photo_id == -1:
                try:
                    username = request.session["username"]
                    user = KuaishouUser.objects.filter(username=username)
                    if len(user) == 0:
                        return code_202(username)
                    else:
                        user = user[0]
                        likes = json.loads(user.likes_count)
                        views = json.loads(user.views_count)
                        comments = json.loads(user.comments_count)
                        counts = json.loads(user.videos_count)
                        count_data = operate(counts)
                        count_24h = operate_24h(counts)
                except KeyError:
                    return JsonResponse({
                        "code": 401,
                        "message": "please login first"
                    })
            else:
                try:
                    v = Video.objects.filter(photo_id=photo_id)
                    username = request.session["username"]
                    user = KuaishouUser.objects.filter(username=username)
                except KeyError:
                    return JsonResponse({
                        "code": 401,
                        "message": "please login first"
                    })
                if len(v) == 0:
                    return JsonResponse({
                        "code": 400,
                        "message": "invalid id"
                    })
                if user[0] != v[0].kuaishou_user:
                    return JsonResponse({
                        "code": 402,
                        "message": "invalid photo id for user id"
                    })
                else:
                    v = v[0]
                    caption = v.caption
                    cover = v.cover
                    play_url = v.play_url
                    likes = json.loads(v.likes)
                    views = json.loads(v.views)
                    comments = json.loads(v.comments)
            t = datetime.datetime.now()
            time_array = [None]*30
            time_array_24h = [None]*24
            for i in range(29, -1, -1):
                time = t - datetime.timedelta(days=i)
                time_array[29-i] = "{}/{}".format(time.month, time.day)

            for i in range(23, -1, -1):
                time = t - datetime.timedelta(hours=i)
                time_array_24h[23-i] = "{}:00".format(time.hour)

            likes_ = operate(likes)
            views_ = operate(views)
            comments_ = operate(comments)
            likes_24h = operate_24h(likes)
            views_24h = operate_24h(views)
            comments_24h = operate_24h(comments)

            return JsonResponse({
                "code": 200,
                "data": {
                    "title": caption,
                    "cover": cover,
                    "play_url": play_url,
                    "likes": likes[-1],
                    "plays": views[-1],
                    "comments": comments[-1],
                    "counts": counts[-1] if counts else "",
                    "time_array": time_array,
                    "like_data": likes_,
                    "comment_data": comments_,
                    "play_data": views_,
                    "count_data": count_data,
                    "time_array_24h": time_array_24h,
                    "like_data_24h": likes_24h,
                    "comment_data_24h": comments_24h,
                    "play_data_24h": views_24h,
                    "count_data_24h": count_24h
                }
            })
        except Exception as e:
            return JsonResponse({"error": str(e)})


class ResetTags(APIView):
    @staticmethod
    @swagger_auto_schema(
                        responses={200: "success",401:"auth failed"}
    )
    def get(request):
        try:
            if "username" not in request.session:
                return code_401()
            username = request.session.get("username")
            if check_admin_name(username):
                all_videos=Video.objects.all()
                for video in all_videos:
                    save_tag(video)
                return JsonResponse({
                    'code': 200,
                    'message': 'success'
                })
            else:
                return code_401()
        except Exception as e:
            return JsonResponse({"error": str(e)})

