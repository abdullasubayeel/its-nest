# Use the official Node.js image as the base image
FROM node:18.18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# This line installs the build-base package using the Alpine package manager (apk). This package includes the necessary tools for building   
# native Node.js modules.
RUN apk add build-base

# This line installs Python 3 using the Alpine package manager. Python is required for some Node.js modules that have native dependencies.
RUN apk add python3

# This line installs the node-gyp package globally using npm. node-gyp is a tool for building native Node.js modules.
RUN npm install -g node-gyp

# Copy package.json and package-lock.json to the container
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env and .env.development files
COPY .env .env.development 

# This line sets an environment variable that tells the Prisma ORM to ignore missing engine checksums. This is useful when deploying to certain 
# platforms like Heroku.
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# This line generates the Prisma client code based on the schema defined in the application.
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Command to run your NestJS application
CMD ["npm", "run", "start:dev"]
