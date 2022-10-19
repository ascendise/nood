FROM node:alpine AS build
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN ng build

FROM caddy:alpine
COPY --from=build /app/docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
