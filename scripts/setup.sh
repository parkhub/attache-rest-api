#!/bin/bash
    export PORT=3000
if [ "$LOCAL_DEPLOYMENT" = "true" ]; then
    export NODE_ENV="qa"
    chmod +x ./secrets.sh
    source ./secrets.sh
fi
