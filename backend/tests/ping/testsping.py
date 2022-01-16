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
def test_details(client):
    response = client.get('/api/test/ping/')
    response = json.loads(response.content)
    assert response["code"] == 200
    assert response["message"] == "pong"

    response = client.post('/api/test/ping/')
    response = json.loads(response.content)
    assert response["code"] == 200
    assert response["message"] == "pong"





@pytest.mark.django_db
def test_register(client):
    response1 = register(client, 'john_new', 'jhonnewpassword')
    response1 = json.loads(response1.content)
    assert response1["code"] == 200
    assert response1["message"] == "username successfully created"

    response2 = register(client, 'john_new', 'jhonnewpassword')
    response2 = json.loads(response2.content)
    assert response2["code"] == 400
    assert response2["message"] == "username already exists"


@pytest.mark.django_db
def test_login(client):
    response1 = register(client, 'john_new', 'jhonnewpassword')
    response1 = login(client, 'john_new', 'jhonnewpassword')
    response1 = json.loads(response1.content)
    assert response1["code"] == 200
    assert response1["message"] == "login successfully"

    response2 = login(client, 'john', 'worngpassword')
    response2 = json.loads(response2.content)
    assert response2["code"] == 400
    assert response2["message"] == "wrong username/password"


@pytest.mark.django_db
def test_logout(client):
    register(client, 'john_new', 'johnpassword')
    login(client, 'john', 'johnpassword')
    response = client.get('/api/user/logout/')
    response = json.loads(response.content)
    assert response["code"] == 200
    assert response["message"] == "success"

