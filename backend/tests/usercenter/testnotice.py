import pytest
import json
from kuaishou_user.models import KuaishouUser
from django.test import Client
from api import load_config


def return_401(client: Client, url):
    response = client.post(url, [{"title": "fake_title1", "message": "fake_message1"},
                                 {"title": "fake_title2", "message": "fake_message2"}],
                           content_type="application/json")
    return response


def return_202(client: Client, url):
    config = load_config()
    session = client.session
    session["username"] = config["admin"]+"adcd"
    session.save()
    fake_user = KuaishouUser(username=config['admin'])
    fake_user.save()
    response = client.post(url, [{"title": "fake_title1", "message": "fake_message1"},
                                 {"title": "fake_title2", "message": "fake_message2"}],
                           content_type="application/json")
    return response


def code_202_401(client: Client, url):
    response = return_401(client, url)
    response = json.loads(response.content)
    assert response["code"] == 401
    response = return_202(client, url)
    response = json.loads(response.content)
    assert response["code"] == 202


def pre_work(client: Client):
    config = load_config()
    session = client.session
    session["username"] = config["admin"]
    session.save()
    fake_user = KuaishouUser(username=config['admin'])
    fake_user.save()
    response = client.post("/api/notice/add", [{"title": "fake_title1", "message": "fake_message1"},
                                               {"title": "fake_title2", "message": "fake_message2"}],
                           content_type="application/json")
    return response, fake_user


@pytest.mark.django_db
def test_add(client):
    response = return_401(client, "/api/notice/add")
    response = json.loads(response.content)
    assert response["code"] == 401
    session = client.session
    session["username"] = "asdfasdf"
    session.save()
    fake_user = KuaishouUser(username=session["username"])
    fake_user.save()
    response = client.post("/api/notice/add", [{"title": "fake_title1", "message": "fake_message1"},
                                               {"title": "fake_title2", "message": "fake_message2"}],
                           content_type="application/json")
    response = json.loads(response.content)
    assert response["code"] == 400

    response, fake_user = pre_work(client)
    response = json.loads(response.content)
    assert response["code"] == 200
    all_notices = fake_user.notification_set.all()
    assert all_notices.count() == 2
    notice1 = all_notices.filter(title="[-]fake_title1")
    assert len(notice1) == 1
    n = notice1[0]
    assert n.message == "fake_message1"


@pytest.mark.django_db
def test_get_all(client):
    code_202_401(client, "/api/notice/all")
    pre_work(client)
    response = json.loads(client.post("/api/notice/all").content)
    assert type(response) is dict
    assert response["code"] == 200
    notices = response["notices"]
    assert type(notices) is list
    assert len(notices) == 2
    notice1 = notices[0]
    assert notice1["title"] == "[-]fake_title1"


@pytest.mark.django_db
def test_mark(client):
    response = json.loads(client.post("/api/notice/unread").content)
    assert response["code"] == 401
    code_202_401(client, "/api/notice/markread")
    session = client.session
    session["username"] = "fakeuser"
    session.save()
    response = json.loads(client.post("/api/notice/unread").content)
    assert response["code"] == 202
    pre_work(client)
    response = client.post("/api/notice/markread",
                           {"id": 1}, content_type="application/json")
    response = json.loads(response.content)
    assert response["code"] == 200
    response = client.post("/api/notice/markread",
                           "hello", content_type="application/json")
    response = json.loads(response.content)
    assert response["code"] == 400
    unread = json.loads(client.post("/api/notice/unread").content)
    assert type(unread) is dict
    assert unread["code"] == 200
    notices = unread["notices"]
    assert type(notices) is list
    assert len(notices) == 1
    notice = notices[0]
    assert notice["title"] == "[-]fake_title2"
