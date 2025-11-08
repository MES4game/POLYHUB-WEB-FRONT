# Stage 1: Build React app
FROM node:24.11.0-trixie-slim AS builder
WORKDIR /app
COPY . .
RUN npm ci \
    && npm run build -- --lint-skip --build-output-path=/build

# Stage 2: Serve with nginx
FROM nginx:1.29.3-trixie

EXPOSE 80
VOLUME /mounted

WORKDIR /usr/share/nginx/html
COPY --chmod=555 --from=builder /build .
COPY --chmod=775 --from=docker_config_folder nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
