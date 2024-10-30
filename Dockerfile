# Stage 1: Build frontend
FROM node:18 AS builder
WORKDIR /app

# Copy client files and install dependencies
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

# Build frontend
COPY client/ .
RUN npm run build

# Stage 2: Set up backend and serve built frontend
FROM node:18
WORKDIR /app

# Copy server files and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy frontend build from builder stage to the server's client directory
COPY --from=builder /app/client/dist ./client

# Copy server source code and build it
COPY server/ .
RUN npm run build

# Expose the port backend listens on (e.g., 3000)
EXPOSE 3000

# Start the server
CMD ["node", "dist/app.js"]
