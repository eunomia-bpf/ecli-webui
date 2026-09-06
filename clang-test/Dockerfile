FROM emscripten/emsdk:latest

RUN apt-get update && apt-get install -y cmake ninja-build python3 git

# Clone only the llvm-project depth 1
RUN git clone --depth 1 -b llvmorg-15.0.7 https://github.com/llvm/llvm-project.git /llvm-project

# Build native tblgen tools
RUN mkdir /build-native && cd /build-native && \
    cmake -G Ninja \
    -DCMAKE_BUILD_TYPE=Release \
    -DLLVM_ENABLE_PROJECTS="clang" \
    -DLLVM_TARGETS_TO_BUILD="X86" \
    /llvm-project/llvm && \
    ninja llvm-tblgen clang-tblgen -j 4

# Build wasm clang
RUN mkdir /build-wasm && cd /build-wasm && \
    emcmake cmake -G Ninja \
    -DCMAKE_BUILD_TYPE=MinSizeRel \
    -DLLVM_ENABLE_PROJECTS="clang" \
    -DLLVM_TARGETS_TO_BUILD="BPF;WebAssembly" \
    -DLLVM_TABLEGEN=/build-native/bin/llvm-tblgen \
    -DCLANG_TABLEGEN=/build-native/bin/clang-tblgen \
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
    -DCMAKE_CXX_FLAGS="-s EXPORT_ES6=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS=['_main'] -s EXPORTED_RUNTIME_METHODS=['FS','callMain']" \
    -DCMAKE_C_FLAGS="-s EXPORT_ES6=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS=['_main'] -s EXPORTED_RUNTIME_METHODS=['FS','callMain']" \
    -DCMAKE_EXE_LINKER_FLAGS="-s EXPORT_ES6=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS=['_main'] -s EXPORTED_RUNTIME_METHODS=['FS','callMain']" \
    /llvm-project/llvm && \
    ninja clang -j 4 && \
    cp bin/clang.js /clang.js && \
    cp bin/clang.wasm /clang.wasm
