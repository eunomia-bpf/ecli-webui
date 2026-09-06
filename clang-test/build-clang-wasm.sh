#!/bin/bash
set -e

# Clone LLVM project if not exists
if [ ! -d "llvm-project" ]; then
    git clone --depth 1 -b llvmorg-15.0.7 https://github.com/llvm/llvm-project.git
fi

# Build LLVM using Emscripten in Podman
podman run --rm -v $(pwd):/src -w /src emscripten/emsdk:latest bash -c "
    apt-get update && apt-get install -y ninja-build cmake gcc g++ python3
    
    # 1. Build native tablegen
    mkdir -p build-native && cd build-native
    cmake -G Ninja \
        -DCMAKE_BUILD_TYPE=Release \
        -DLLVM_ENABLE_PROJECTS='clang;lld' \
        ../llvm-project/llvm
    ninja llvm-tblgen clang-tblgen
    cd ..

    # 2. Build WebAssembly clang
    mkdir -p build-wasm && cd build-wasm
    emcmake cmake -G Ninja \
        -DCMAKE_BUILD_TYPE=Release \
        -DLLVM_TARGETS_TO_BUILD='BPF;WebAssembly' \
        -DLLVM_ENABLE_PROJECTS='clang;lld' \
        -DLLVM_TABLEGEN=/src/build-native/bin/llvm-tblgen \
        -DCLANG_TABLEGEN=/src/build-native/bin/clang-tblgen \
        -DLLVM_ENABLE_DUMP=OFF \
        -DLLVM_ENABLE_ASSERTIONS=OFF \
        -DLLVM_ENABLE_EXPENSIVE_CHECKS=OFF \
        -DLLVM_ENABLE_BACKTRACES=OFF \
        -DLLVM_BUILD_TOOLS=OFF \
        -DLLVM_ENABLE_THREADS=OFF \
        -DLLVM_BUILD_LLVM_DYLIB=OFF \
        -DLLVM_INCLUDE_TESTS=OFF \
        -DCLANG_ENABLE_STATIC_ANALYZER=OFF \
        -DCLANG_ENABLE_ARCMT=OFF \
        ../llvm-project/llvm
    
    ninja clang lld
"
