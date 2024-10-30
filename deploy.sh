#!/bin/bash

# Pull latest changes
git pull

# Build and restart containers
docker-compose down
docker-compose up --build -d

# Show logs
docker-compose logs -f