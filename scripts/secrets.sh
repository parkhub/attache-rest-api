#!/bin/bash

# source ./.env

if [ "$NODE_ENV" = "local" ]; then
    NODE_ENV="develop"
fi
# Fetch and export DB credentials
DB_CREDENTIALS=$(aws secretsmanager get-secret-value --secret-id "${NODE_ENV}/db" --query SecretString --output text)
export DB_CREDENTIALS

# Fetch and export TIBA credentials
TIBA_CREDENTIALS=$(aws secretsmanager get-secret-value --secret-id "${NODE_ENV}/tiba" --query SecretString --output text)
export TIBA_CREDENTIALS

# Fetch and process env.NODE_ENV/attache-rest-apps for individual key/value pairs
ATTACHE_REST_APPS_JSON=$(aws secretsmanager get-secret-value --secret-id "${NODE_ENV}/attache-rest-apps" --query SecretString --output text)

NPM_TOKENS_JSON=$(aws secretsmanager get-secret-value --secret-id "attache/npm_tokens" --query SecretString --output text)

NPM_TOKEN=$(echo "$NPM_TOKENS_JSON" | jq -r '.restapi_readonly')
export NPM_TOKEN

# Loop through each key/value pair and export them
echo $ATTACHE_REST_APPS_JSON | jq -r 'to_entries | .[] | .key + "=" + .value' | while IFS= read -r line; do
    KEY=$(echo $line | cut -d '=' -f1)
    VALUE=$(echo $line | cut -d '=' -f2)
    # Exporting with key converted to uppercase
    export $(echo $KEY | awk '{print toupper($0)}')="$VALUE"
done

# Rest of the script...
