#!/bin/bash
if [ "$LOCAL_DEPLOYMENT" = "true" ]; then
    export NODE_ENV="develop"
    chmod +x ./secrets.sh
    source ./secrets.sh
fi
