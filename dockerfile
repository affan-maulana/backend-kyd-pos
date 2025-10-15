# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

COPY . .

# Default command for development with live reload
CMD ["npm", "run", "start:dev"]
