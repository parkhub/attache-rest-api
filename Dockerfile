# Use a Node.js base image with TypeScript already installed
FROM node:18-alpine as builder

# Define a build argument for NODE_ENV, with a default value
ARG STAGE=develop

# Set NODE_ENV environment variable
ENV NODE_ENV=${STAGE}

RUN wget "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -O "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install
    
RUN apk add --no-cache jq

# Set the working directory in the container
WORKDIR /usr

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

RUN ./usr/scripts/secrets.sh
# Install dependencies
RUN npm install


# Copy the rest of the application
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# # Use a new base image for the production environment
# FROM node:18-alpine

# WORKDIR /usr/dist

# # Copy package.json and package-lock.json (or yarn.lock)
# COPY package*.json ./

# # Install production dependencies
# RUN npm install --only=production

# # Copy the compiled JavaScript from the builder stage
# COPY --from=builder /usr/src ./dist

# Your app binds to port 3000, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/index.js"]
