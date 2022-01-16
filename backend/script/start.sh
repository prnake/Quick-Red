#!/bin/sh
python manage.py makemigrations
python manage.py makemigrations kuaishou_user
python manage.py makemigrations video
python manage.py migrate
python manage.py runserver $BIND --insecure
