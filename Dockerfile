# Use a Node.js base image with TypeScript already installed
FROM node:18-alpine as builder

ARG LOCAL_DEPLOYMENT=false

ARG NPM_TOKEN

ENV NPM_TOKEN=${NPM_TOKEN}

WORKDIR /home/app

COPY helm/* ./helm/

COPY scripts/* ./scripts/

RUN chmod +x scripts/setup.sh

COPY .npmrc .npmrc
# Copy package.json and package-lock.json (or yarn.lock)

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ./.npmrc

COPY package*.json ./
# Install dependencies and remove .npmrc
RUN npm install && rm -f .npmrc
# Copy the rest of the application
COPY . .
# Compile TypeScript to JavaScript
RUN npm run build
# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
