#!/bin/sh
CONFIG_FILE_TEMPLATE = "srv/dist/nood/assets/config.json.template"
echo $(cat CONFIG_FILE_TEMPLATE | \
  jq --arg apiBaseUri "$API_BASE_URI" \
  --arg issuer "$OAUTH_ISSUER" \
  --arg redirectUri "$OAUTH_REDIRECT_URI" \
  --arg clientId "$OAUTH_CLIENT_ID" \
  --arg logoutUrl "$OAUTH_LOGOUT_URL" \
  --arg loginUrl "$OAUTH_LOGIN_URL" \
  --arg audience "$OAUTH_AUDIENCE" \
  '.apiBaseUrl |= $apiBaseUri | oauth.issuer |= $issuer | oauth.clientId |= $clientId | oauth.logoutUrl |= $logoutUrl | oauth.audience |= audience' \
  ) > srv/dist/nood/assets/config.json
