#!/bin/bash
    export PORT=3000
if [ "$LOCAL_DEPLOYMENT" = "true" ]; then
    export NODE_ENV="develop"
    chmod +x ./secrets.sh
    source ./secrets.sh
fi
