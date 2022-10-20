#!/bin/sh

#Create config file from environment variables

CONFIG_FILE_TEMPLATE="/srv/assets/config.json.template"
echo $(cat $CONFIG_FILE_TEMPLATE | \
  jq --arg apiBaseUri "$API_BASE_URI" \
  --arg issuer "$OAUTH_ISSUER" \
  --arg redirectUri "$OAUTH_REDIRECT_URI" \
  --arg clientId "$OAUTH_CLIENT_ID" \
  --arg logoutUrl "$OAUTH_LOGOUT_URL" \
  --arg loginUrl "$OAUTH_LOGIN_URL" \
  --arg audience "$OAUTH_AUDIENCE" \
  '.apiBaseUri |= $apiBaseUri | .oauth.issuer |= $issuer | .oauth.redirectUri |= $redirectUri | .oauth.clientId |= $clientId | .oauth.logoutUrl |= $logoutUrl | .oauth.loginUrl |= $loginUrl | .oauth.audience |= $audience' \
  ) > /srv/assets/config.json

#Run caddy

caddy run --config "/etc/caddy/Caddyfile" --adapter caddyfile
