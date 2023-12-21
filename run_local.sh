#!/bin/bash

COMMAND=$1
export NODE_ENV=$2
RUN=$3
RUNVALUE=$RUN
export LOCAL_DEPLOYMENT="true"

if [ "$COMMAND" != "build" ] && [ "$COMMAND" != "build-docker" ] && [ "$COMMAND" != "start" ] && [ "$COMMAND" != "start-docker" ] && [ "$COMMAND" != "test" ] && [ "$COMMAND" != "test-docker" ] && [ "$COMMAND" != "help" ]; then
    echo "Command not recognized"
    exit 1
fi


if [ "$COMMAND" = "start" ] && [ -n "$RUN" ]; then
    echo "this command is not compatible with run"
    exit 2
fi

if [ "$COMMAND" = "start-docker" ] && [ -n "$RUN" ]; then
    echo "this command is not compatible with run"
    exit 3
fi

if [ "$COMMAND" = "test" ] && [ -n "$RUN" ]; then
    echo "this command is not compatible with run"
    exit 4
fi

if [ "$COMMAND" = "test-docker" ] && [ -n "$RUN" ]; then
    echo "this command is not compatible with run"
    exit 5
fi

if [ "$NODE_ENV" != "local" ] && [ "$NODE_ENV" != "develop" ] && [ "$NODE_ENV" != "staging" ] && [ "$NODE_ENV" != "qa" ] && [ "$NODE_ENV" != "production" ] && [ "$NODE_ENV" != "test" ]; then
    echo "Node environment not recognized"
    exit 6
fi

if [[ "$RUNVALUE" =~ ^.*install.*$ ]]; then
    npm install
    if [[ "$RUN" =~ ^.*-.*$ ]]; then
        RUNVALUE=${RUN#install-}
    fi
fi
if [ "$RUNVALUE" != "start" ] && [ "$RUNVALUE" != "start-docker" ] && [ "$RUNVALUE" != "test" ] && [ "$RUNVALUE" != "test-docker" ] && [ "$RUN" != "install" ]; then
    echo "Run not recognized"
    exit 7
fi

if [ "$COMMAND" = "build" ]; then
    chmod +x ./scripts/setup.sh
    source ./scripts/setup.sh
    npm run build
fi

if [ "$COMMAND" = "build-docker" ]; then
    chmod +x ./scripts/compose.sh
    source ./scripts/compose.sh
fi

if [ "$COMMAND" = "start" ] && [ -z "$RUN" ]; then
    npm run start
fi

if [ "$COMMAND" = "start-docker" ] && [ -z "$RUN" ]; then
    docker-compose run attache-rest-api npm start
fi

if [ "$COMMAND" = "test" ] && [ -z "$RUN" ]; then
    npm run test
fi

if [ "$COMMAND" = "test-docker" ] && [ -z "$RUN" ]; then
    docker-compose run attache-rest-api npm run test
fi

if [ "$COMMAND" = "help" ]; then
    echo "Usage: source ./build_local.sh [command] [node_env] [run]"
    echo "Commands:"
    echo "  build: build the app"
    echo "  build-docker: build the app in docker"
    echo "  start: start the app"
    echo "  start-docker: start the app in docker"
    echo "  test: run tests"
    echo "  test-docker: run tests in docker"
    echo "  help: display this message"
    echo "Node Environments: this determines which environment to run locally"
    echo "  local: local development"
    echo "  develop: development"
    echo "  staging: staging"
    echo "  qa: qa"
    echo "  production: production"
    echo "  test: test"
    echo "Run: pass in a value to run the app and/or install dependencies when the command value is build or build-docker"
    echo "  install: install dependencies"
    echo " you can prefix any of the below run values with install- to install dependencies"
    echo "  start: start the app"
    echo "  start-docker: start the app in docker"
    echo "  test: run tests"
    echo "  test-docker: run tests in docker"
fi

if [ "$RUNVALUE" = "start" ]; then
    npm run start
fi

if [ "$RUNVALUE" = "start-docker" ]; then
    docker-compose run attache-rest-api npm start
fi

if [ "$RUNVALUE" = "test" ]; then
    npm run test
fi

if [ "$RUNVALUE" = "test-docker" ]; then
    docker-compose run attache-rest-api npm run test
fi
