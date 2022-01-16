import pytest
import json
from flask import Flask
from flask import session
from django.contrib.auth.models import User
from api import UnsafeSessionAuthentication, load_config


def register(client, username, password):
    response1 = client.post('/api/user/register', {
        'username': username,
        'password': password
    },
                            content_type="application/json")
    return response1


def login(client, username, password):
    response1 = client.post('/api/user/login', {
        'username': username,
        'password': password
    },
                            content_type="application/json")
    return response1


@pytest.mark.django_db
def test_Url(client):
    response1 = client.get('/api/kuaishou/url/')
    response1 = json.loads(response1.content)
    assert response1["code"] == 401
    assert response1["message"] == "login first"

    register(client, 'john', 'johnpassword')
    login(client, 'john', 'johnpassword')
    response2 = client.get('/api/kuaishou/url/')
    response2 = json.loads(response2.content)
    config = load_config()
    assert response2["code"] == 200
    assert response2[
        "message"] == "https://open.kuaishou.com/oauth2/authorize?app_id={" "}&scope=user_info&response_type=code&ua=pc&redirect_uri={}&state={}".format(
            config['app_id'], config["redirection_uri"], 'john')

