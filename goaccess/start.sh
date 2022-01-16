#!/bin/sh
set -e
cron
nginx -g "daemon off;"