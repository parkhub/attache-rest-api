#!/bin/bash

NPM_TOKENS_JSON=$(aws secretsmanager get-secret-value --secret-id "attache/npm_tokens" --query SecretString --output text)
NPM_TOKEN=$(echo "$NPM_TOKENS_JSON" | jq -r '.restapi_readonly')
export NPM_TOKEN

docker-compose up attache-rest-api
