#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "Building Docker image for wasm-clang..."
podman build -t wasm-clang-builder .

echo "Extracting clang.js and clang.wasm..."
CONTAINER_ID=$(podman create wasm-clang-builder)
podman cp $CONTAINER_ID:/clang.js ../wasm-bin/clang.js
podman cp $CONTAINER_ID:/clang.wasm ../wasm-bin/clang.wasm
podman rm $CONTAINER_ID

echo "Successfully built and exported wasm-clang to ../wasm-bin/"
