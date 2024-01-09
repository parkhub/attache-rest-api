#!/bin/bash

COMMAND=$1
RUN=$3
NODE_ENV="local"
export LOCAL_DEPLOYMENT="true"

if [ -n "$2" ]; then
    NODE_ENV=$2
fi

export NODE_ENV

if [ -z "$COMMAND" ]; then
    echo "Command not specified"
    echo "run ./run_local.sh help for more information"
fi

# ---START---

if [ -n "$COMMAND" ]; then
  # ---ERROR HANDLING---
    if [ "$COMMAND" != "build" ] && [ "$COMMAND" != "build-docker" ] && [ "$COMMAND" != "start" ] && [ "$COMMAND" != "start-docker" ] && [ "$COMMAND" != "test" ] && [ "$COMMAND" != "test-docker" ] && [ "$COMMAND" != "help" ] && [ "$COMMAND" != "setup-repo" ]; then
        echo "Command not recognized"
        exit 1
    fi

    if [ "$COMMAND" != "build" ] && [ "$COMMAND" != "build-docker" ] && [ -n "$RUN" ]; then
        echo "Run is not compatible with this command"
        exit 2
    fi

    if [ "$COMMAND" = "setup-repo" ] && [ "$RUN" = "start-docker" ]; then
        echo "setup-repo command is not compatible with start-docker, please use start instead"
        exit 3
    fi

    if [ "$COMMAND" = "setup-repo" ] && [ "$RUN" = "test-docker" ]; then
        echo "setup-repo command is not compatible with test-docker, please use test instead"
        exit 4
    fi

    if [ "$COMMAND" = "build-docker" ] && [ "$RUN" = "start" ]; then
        echo "build-docker command is not compatible with start, please use start-docker instead"
        exit 5
    fi

    if [ "$COMMAND" = "build-docker" ] && [ "$RUN" = "test" ]; then
        echo "build-docker command is not compatible with test, please use test-docker instead"
        exit 6
    fi

    if [ "$COMMAND" = "build" ] && [ "$RUN" = "start-docker" ]; then
        echo "build command is not compatible with start-docker, please use start instead"
        exit 7
    fi

    if [ "$COMMAND" = "build" ] && [ "$RUN" = "test-docker" ]; then
        echo "build command is not compatible with test-docker, please use test instead"
        exit 8
    fi

    if [ "$NODE_ENV" != "local" ] && [ "$NODE_ENV" != "develop" ] && [ "$NODE_ENV" != "staging" ] && [ "$NODE_ENV" != "qa" ] && [ "$NODE_ENV" != "production" ] && [ "$NODE_ENV" != "test" ]; then
        echo "Node environment not recognized"
        exit 9
    fi

    if [ -n "$RUN" ]; then
        if [ "$RUN" != "start" ] && [ "$RUN" != "start-docker" ] && [ "$RUN" != "test" ] && [ "$RUN" != "test-docker" ]; then
            echo "Run not recognized"
            exit 10
        fi
    fi
    # ---END ERROR HANDLING---

    # ---COMMAND---
    if [ "$COMMAND" = "setup-repo" ]; then
        npm install
        if [ ! -d "./dist" ]; then
            mkdir dist
        fi
        chmod +x ./scripts/setup.sh
        source ./scripts/setup.sh
        npm run build
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

    if [ "$COMMAND" = "test" ] && [ -z "$RUN" ]; then
        npm run test
    fi

    if [ "$COMMAND" = "start-docker" ] && [ -z "$RUN" ]; then
        docker-compose run attache-rest-api npm start
    fi

    if [ "$COMMAND" = "test-docker" ] && [ -z "$RUN" ]; then
        docker-compose run attache-rest-api npm run test
    fi

    if [ "$COMMAND" = "help" ]; then
        echo "Usage: source ./run_local.sh [command] [node_env] [run]"
        echo "Commands:"
        echo "  build: build the app"
        echo "  build-docker: build the app in docker"
        echo "  start: start the app"
        echo "  start-docker: start the app in docker"
        echo "  test: run tests"
        echo "  test-docker: run tests in docker"
        echo "  setup-repo: setup the repo"
        echo "  help: display this message"
        echo "Node Environments: this determines which environment to run locally"
        echo "  local: local development"
        echo "  develop: development"
        echo "  staging: staging"
        echo "  qa: qa"
        echo "  production: production"
        echo "  test: test"
        echo "Run: pass in a value to run the app when the command value is build, build-docker, or setup-repo"
        echo "  start: start the app"
        echo "  start-docker: start the app in docker"
        echo "  test: run tests"
        echo "  test-docker: run tests in docker"
    fi
  # ---END COMMAND---

  # ---RUN---
  if [ -n "$RUN" ]; then
    if [ "$RUN" = "start" ]; then
        npm run start
    fi

    if [ "$RUN" = "start-docker" ]; then
        docker-compose run attache-rest-api npm start
    fi

    if [ "$RUN" = "test" ]; then
        npm run test
    fi

    if [ "$RUN" = "test-docker" ]; then
        docker-compose run attache-rest-api npm run test
    fi
  fi
  # ---END RUN---

fi
# ---END---