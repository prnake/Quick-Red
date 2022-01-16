FROM node:14 as build

RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

ENV HOME=/opt/app

WORKDIR $HOME
COPY . $HOME

RUN yarn
RUN yarn build

FROM nginx:1.19

COPY --from=build /opt/app/dist /usr/share/nginx/html
COPY --from=build /opt/app/nginx.conf.bak /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
