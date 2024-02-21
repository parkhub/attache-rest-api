# Use a Node.js base image with TypeScript already installed
FROM node:18-alpine as builder

ARG NPM_TOKEN

ARG NODE_ENV

ARG reserve_app

ARG reserve_secret

ARG db

ARG tiba_credentials

ENV NODE_ENV=${NODE_ENV}

ENV NPM_TOKEN=${NPM_TOKEN}

ENV reserve_app=${reserve_app}

ENV reserve_secret=${reserve_secret}

ENV db=${db}

ENV tiba_credentials=${tiba_credentials}


WORKDIR /home/app

COPY helm/* ./helm/

COPY scripts/* ./scripts/

RUN chmod +x scripts/setup.sh

COPY .npmrc .npmrc
# Copy package.json and package-lock.json (or yarn.lock)

COPY package*.json ./
# Install dependencies and remove .npmrc
RUN npm install && rm -f .npmrc
# Copy the rest of the application
COPY . .
# Compile TypeScript to JavaScript
RUN npm run build
# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
