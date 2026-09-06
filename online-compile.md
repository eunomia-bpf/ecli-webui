# How the Eunomia-bpf Playground Online Compiler Works

This document explains how the `eunomia-bpf` web playground compiles, packages, and downloads eBPF programs. The browser does all the work. It does not use a backend server.

## 1. Core technology: browser-based Clang with WASM

The compiler uses the Emception library. Emception uses Emscripten to compile the LLVM/Clang toolchain into WebAssembly (WASM). This lets Clang run directly in the JavaScript environment of the browser.

When the page loads, the frontend initializes the Emception object:
- **Stdout and stderr capture**: The frontend captures the standard output and standard error from Emception. It binds these outputs to `consoleCtx`. The UI Console component shows the compiler logs in real time.
- **MEMFS (memory file system)**: Emception uses the memory file system of the browser. The compiler reads header files, writes source code, and outputs `.o` files in this virtual file system.

## 2. Virtual file system (MEMFS) setup and dependency injection

The C compiler requires header files in the file system. Before the compile step, the browser must create a virtual file environment that contains the BPF dependencies.

### 2.1 BPF system header injection

When the page loads (`onMounted`), the application uses `fetch` requests to get the base system header files from the static server. The application writes these files into the MEMFS directories:
- `/vmlinux.h` (This contains the full Linux kernel struct definitions for CO-RE.)
- `/bpf/bpf_core_read.h`
- `/bpf/bpf_endian.h`
- `/bpf/bpf_helper_defs.h`
- `/bpf/bpf_helpers.h`
- `/bpf/bpf_tracing.h`

### 2.2 Source code injection

When the user clicks the **Compile** button, the application finds all open files in the code editor (`tabs` object). These files include `.c` source files and custom `.h` files. The application uses `emception.fileSystem.writeFile` to write them into the MEMFS root directory `/`.

> **Safe loading design**: When the application loads an example, it fetches multiple files from the remote server. The UI shows a full-screen loading animation. Because `fetch` is asynchronous, a fast user click can cause a `file not found` compiler error. The `isLoadingExample` state stops the compiler from starting before the file system is ready.

## 3. Clang compiler execution

When all files are in MEMFS, the frontend calls `emception._run_process()`. This executes the virtual `/usr/bin/clang`.

### 3.1 Compiler flags

We use the same compiler command as a local Linux terminal:
```bash
/usr/bin/clang -g -O2 -target bpf -D__TARGET_ARCH_x86 -I/ -c /<main.bpf.c> -o /main.bpf.o
```
These parameters do the following in the web environment:
- `-target bpf`: This tells LLVM to build BPF bytecode. It does not build a binary for the local machine or WebAssembly.
- `-O2` and `-g`: These enable standard optimization and add debug information.
- `-I/`: This adds the MEMFS root directory `/` to the header search path. Code can find the file with `#include "vmlinux.h"`.
- `-D__TARGET_ARCH_x86`: **[Crucial fix]** The `bpf_tracing.h` file contains hook macros like `BPF_KRETPROBE` and `PT_REGS_RC`. These macros must know the target CPU architecture to parse register macros. We pass the x86 macro definition. If we do not pass it, the macro expansion throws a `_Pragma("GCC error")` and stops the compiler.

### 3.2 Source code compatibility

The `/vmlinux.h` file comes from a new Linux kernel:
- In old kernels, `struct filename` has a `const char* name` pointer member.
- In new kernels, `struct filename` uses an inline array `const char iname[168]`.
- We adapt the CO-RE operations in the example code. For example, `fentry-link` uses `name->iname` instead of `name->name`. The `kprobe-link` example calculates the address offset with `(const char *)name + bpf_core_field_offset(name->iname)`. This makes sure the code passes the strict static checks of the compiler.

## 4. Package generation (Eunomia Package)

When Clang finishes with exit code `0` (Success), it outputs the `/main.bpf.o` object file in the MEMFS root directory. The application then starts the Eunomia packaging process:

1. **Read binary**: The application uses `emception.fileSystem.readFile('/main.bpf.o')` to read the ELF binary file from the Wasm memory into a JavaScript `Uint8Array`.
2. **Base64 encode**: The application converts the byte array into an ASCII string. Then it uses `window.btoa` to encode it as Base64.
3. **Build JSON package**: The application creates a JSON object that matches the `eunomia-bpf` toolchain specification. The `bpf_object` field holds the Base64 string. The `meta` field holds the metadata:
   ```json
   {
       "bpf_object": "f0VMRgIBAQAAAAAAAAAAAA...",
       "bpf_object_size": 1337,
       "meta": {
           "bpf_skel": {
               "data_sections": [],
               "maps": [],
               "progs": []
           },
           "eunomia_version": "0.1.0"
       }
   }
   ```
4. **Final string conversion**: The application serializes this JSON object into a string. It encodes this string as Base64 again. It stores the final string in the reactive `standbyBinary.program_data_buf` Vue reference.

## 5. Download the package

When `standbyBinary` is ready, the **Download** button in the UI becomes active.
When the user clicks the download button:
1. The `downloadProgram` function starts.
2. The function uses `window.atob` to decode `standbyBinary.program_data_buf` back into a JSON text string.
3. The function uses a HTML5 `Blob` object to create a file stream (`type: 'application/json'`).
4. The function uses `URL.createObjectURL` to make a temporary link. It creates a `<a download="package.json">` tag and simulates a click. This shows the browser download dialog.
5. The user receives a standard package file. The `ecli` tool can run this file directly. The process requires no backend server.
