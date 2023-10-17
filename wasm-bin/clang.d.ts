/// <reference types="emscripten" />
/** Above will import declarations from @types/emscripten, including Module etc. */
/** although it doesn't work */

// This will merge to the existing EmscriptenModule interface from @types/emscripten
declare interface ClangModule extends EmscriptenModule {
    _main(argc: string[], argv: string[]): number;
}

export default function init_clang_module(): ClangModule;
