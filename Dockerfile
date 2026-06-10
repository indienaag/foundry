FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html styles.css main.js favicon.svg /srv/

EXPOSE 8080
