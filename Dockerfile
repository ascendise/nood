FROM node:alpine AS build
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npx ng build --configuration production

FROM caddy:alpine
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist/nood /srv
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
RUN apk add --no-cache jq
RUN chmod u+x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
