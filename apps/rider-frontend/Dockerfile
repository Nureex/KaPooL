FROM nginx:1.25.1-alpine
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY /apps/rider-frontend/build/web /usr/share/nginx/html