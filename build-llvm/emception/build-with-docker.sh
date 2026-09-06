#!/bin/bash

SRC=$(dirname $0)
SRC=$(realpath "$SRC")

pushd $SRC/docker
docker build \
    -t localhost/emception_build:latest \
    .
popd

mkdir -p $(pwd)/build/emsdk_cache

docker run \
    -i --rm \
    -v $(pwd):$(pwd) \
    -v $(pwd)/build/emsdk_cache:/emsdk/upstream/emscripten/cache \
    localhost/emception_build:latest \
    bash -c "cd $(pwd) && ./build.sh"