FROM gplane/pnpm:alpine as builder

WORKDIR /app

# copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# install deps
RUN pnpm install --frozen-lockfile

# copy project
COPY . .
COPY deploy/.env.production ./.env

# build
RUN pnpm run build

FROM nginx/nginx-prometheus-exporter:latest as exporter
FROM nginx:alpine

WORKDIR /app

# copy config and exporter
COPY --from=exporter /usr/bin/nginx-prometheus-exporter /usr/bin/nginx-prometheus-exporter
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/supervisor.conf /etc/supervisor/supervisor.conf

RUN apk add --no-cache supervisor

# copy dist
COPY --from=builder /app/dist ./dist
RUN chmod 755 -R ./dist

EXPOSE 80 9113
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisor.conf"]
