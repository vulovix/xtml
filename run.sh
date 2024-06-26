#!/bin/bash

# Define the image name (replace if desired)
IMAGE_NAME="my-html-processor"

# Build the Docker image
docker build -t "$IMAGE_NAME" .

# Run the container with volume mounting for dist folder
# docker run -v $(pwd)/dist:/app/dist -p 80:80 --rm "$IMAGE_NAME"
docker run -v $(pwd)/dist:/app/dist -p 80:80 --rm "$IMAGE_NAME"

echo "Successfully generated output in $(pwd)/dist/index.html"
