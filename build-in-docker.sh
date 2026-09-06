#!/bin/bash

# Exit on any error
set -e

IMAGE_NAME="ecli-webui"
CONTAINER_NAME="ecli-webui-extract"
OUTPUT_DIR="dist"

echo "🔨 Building the ecli-webui Docker image..."
docker build -t ${IMAGE_NAME} .

echo "📦 Extracting the built static files to ./${OUTPUT_DIR}..."
# Remove any existing extract container
docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

# Create a temporary container from the image
docker create --name ${CONTAINER_NAME} ${IMAGE_NAME}

# Remove existing dist directory to ensure a clean copy
rm -rf ${OUTPUT_DIR}

# Copy the built files from the nginx html directory
docker cp ${CONTAINER_NAME}:/usr/share/nginx/html ${OUTPUT_DIR}

# Clean up the temporary container
docker rm -f ${CONTAINER_NAME}

echo "✅ Build complete!"
echo "The static files have been extracted to the './${OUTPUT_DIR}' directory."
echo ""
echo "🚀 To run the application in a local web server via Docker, use:"
echo "    docker run -d -p 8080:80 --name my-ecli-webui ${IMAGE_NAME}"
echo "    Then open http://localhost:8080 in your browser."
