#!/bin/bash

# if [ "$NODE_ENV" = "local" ]; then
#     NODE_ENV="develop"
# fi

# Fetch and process env.NODE_ENV/attache-rest-apps for individual key/value pairs
ATTACHE_RESTAPI_JSON=$(aws secretsmanager get-secret-value --secret-id "${NODE_ENV}/attache-restapi" --query SecretString --output text)

# Loop through each key/value pair and export them
echo $ATTACHE_RESTAPI_JSON | jq -r 'to_entries | .[] | .key + "=" + .value' | while IFS= read -r line; do
    KEY=$(echo $line | cut -d '=' -f1)
    VALUE=$(echo $line | cut -d '=' -f2)
    # Exporting with key converted to uppercase
    export $(echo $KEY)="$VALUE"
done

# Rest of the script...
