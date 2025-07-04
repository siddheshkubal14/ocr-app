#!/bin/bash

# Configuration
DOCKER_USERNAME="sid0014"                   
DOCKER_IMAGE_NAME="ocr-app"            
TAG=$(date +'%Y%m%d%H%M%S')                 
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Step 1: Build Docker image
echo "Building Docker image..."
docker build -t ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:latest .

# Step 2: Tag the image with timestamp
echo "Tagging image as ${TAG}..."
docker tag ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:latest ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${TAG}

# Step 3: Push both tags to Docker Hub
echo "Pushing images to Docker Hub..."
docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:latest
docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${TAG}

# Step 4: Deploy with Docker Compose
echo "Deploying application with Docker Compose..."
docker compose -f $DOCKER_COMPOSE_FILE up -d --build

# Step 5: Show running services
echo "Deployment complete. Service status:"
docker compose -f $DOCKER_COMPOSE_FILE ps
