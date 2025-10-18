# Backend Dockerfile for gaixiang backend service
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update -y && apt-get install -y openssl

# Copy backend package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source code
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the backend
RUN npm run build

# Create data directory for SQLite
RUN mkdir -p /app/data

# Create startup script with database initialization
RUN echo '#!/bin/bash
set -e
npx prisma db push --force-reset
npm start' > /app/start.sh
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 8080

# Start the backend server
CMD ["/app/start.sh"]