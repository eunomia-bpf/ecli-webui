/// <reference types="emscripten" />

Module['onRuntimeInitialized'] = () => {
    console.log('wasm-bin/clang.post.js: Module.onRuntimeInitialized');
    Module['postRun'] = () => {
        console.log('wasm-bin/clang.post.js: Module.postRun');
        console.log('wasm-bin/clang.post.js: Module.ccall(\'main\')');
        Module.ccall('main');
    };
}
