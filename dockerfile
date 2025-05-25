# Use an official base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

#define build arguments
ARG NODE_ENV
ARG PORT
ARG HOST
ARG LOG_LEVEL
ARG CORS_ORIGIN
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_SSL

# Define environment variables
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV HOST=$localhost
ENV LOG_LEVEL=$LOG_LEVEL
ENV CORS_ORIGIN=$CORS_ORIGIN
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV DB_SSL=$DB_SSL

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Command to run the application
CMD ["npm", "start"]