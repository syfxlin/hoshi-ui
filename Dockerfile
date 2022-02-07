FROM gplane/pnpm:alpine as builder

WORKDIR /app

# copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# install deps
RUN pnpm install --frozen-lockfile

# copy project
COPY . .

# build
RUN cp config/.env.production ./.env
RUN pnpm run build

FROM nginx:alpine

WORKDIR /app

# copy config
COPY config/nginx.conf /etc/nginx/nginx.conf

# copy dist
COPY --from=builder /app/dist ./dist
RUN chmod 755 -R ./dist
