FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html main.js styles.css favicon.svg /usr/share/nginx/html/

EXPOSE 8080
