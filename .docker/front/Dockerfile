# Stage 1: Build React app with Webpack
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g npm@latest \
    && npm i \
    && npm run build -- --lint-skip --build-output-path=/build

# Stage 2: Serve with nginx
FROM nginx:alpine

VOLUME /mounted

ENV DEV=false \
    HOST=127.0.0.1 \
    API_URL=https://127.0.0.1/api \
    DATA_URL=https://127.0.0.1/data

COPY --from=docker_config_folder . /
RUN cp -f /nginx.conf /etc/nginx/conf.d/default.conf \
    && chmod +x /entrypoint.sh

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /build .

ENTRYPOINT ["/entrypoint.sh"]
