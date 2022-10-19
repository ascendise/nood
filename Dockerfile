FROM node:alpine AS build
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npx ng build

FROM caddy:alpine
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist/nood /srv
