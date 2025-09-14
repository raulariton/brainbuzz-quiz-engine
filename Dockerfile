# Use Node.js 20 on Alpine Linux (lightweight)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This allows Docker to cache the npm install step
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Command to start your application
CMD ["npm", "start"]