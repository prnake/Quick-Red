"""
WSGI config for secoder project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from apscheduler.schedulers.background import BackgroundScheduler
from kuaishou_user import tasks
from api import load_config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'secoder.settings')

config = load_config()

scheduler = BackgroundScheduler()
scheduler.add_job(tasks.refresh, 'interval', seconds=config["refresh_time"], max_instances=10)
scheduler.add_job(tasks.renew_info, 'interval', seconds=60, max_instances=20)
scheduler.add_job(tasks.daily_report, 'cron', hour=0)
scheduler.start()

application = get_wsgi_application()
