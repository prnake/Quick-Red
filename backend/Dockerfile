FROM python:3.8

WORKDIR /opt/secoder
ENV BIND 0.0.0.0:80

COPY requirements.txt /opt/secoder/
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

COPY . /opt/secoder/

EXPOSE 80

CMD ["/bin/sh", "/opt/secoder/script/start.sh"]
