#!/bin/bash

NPM_TOKENS_JSON=$(aws secretsmanager get-secret-value --secret-id "attache/npm_tokens" --query SecretString --output text)
NPM_TOKEN=$(echo "$NPM_TOKENS_JSON" | jq -r '.restapi_readonly')

export PORT=3000

export NODE_ENV="qa"
chmod +x ./secrets.sh
source ./secrets.sh

export NPM_TOKEN

docker compose build --no-cache

docker-compose up attache-rest-api
