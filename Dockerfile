FROM nginx:1.27-alpine
COPY dist /usr/share/nginx/html
RUN mkdir -p /etc/nginx/templates
COPY .nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
