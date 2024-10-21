# Use the official Node.js image from Docker Hub (Node.js 20)
FROM node:20.17.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env_dev file from the env directory to the working directory as .env
COPY env/.env_dev .env

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]