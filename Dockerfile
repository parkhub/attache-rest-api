# Use a Node.js base image with TypeScript already installed
FROM node:18-alpine as builder


# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Copy the scripts directory
COPY scripts/* ./scripts/

# Make the secrets script executable
RUN chmod +x scripts/secrets.sh

# Run the secrets script
RUN npm run populate_secrets
# Install dependencies
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install

# Copy the rest of the application
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/index.js"]
