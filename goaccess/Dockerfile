FROM nginx:1.19

EXPOSE 80

COPY sources.list /etc/apt/sources.list
RUN apt-get update && apt-get -y install cron goaccess fonts-font-awesome

ADD crontabfile /etc/cron.d/hello-cron
RUN ln -s /usr/share/fonts-font-awesome/fonts /usr/share/nginx/html/
RUN chmod 0644 /etc/cron.d/hello-cron
RUN touch /var/log/cron.log
RUN crontab /etc/cron.d/hello-cron
RUN cron
ADD start.sh /
ADD crontab.sh /
RUN chmod +x /start.sh /crontab.sh

CMD ["/start.sh"]