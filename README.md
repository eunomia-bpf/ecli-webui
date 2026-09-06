# eunomia-bpf Playground

The `eunomia-bpf` playground is a web application that lets you write, compile, and package eBPF programs in your browser. It does not use a backend server.

The playground uses the Emception library to run the Clang compiler directly in the browser with WebAssembly. You can edit C code, compile it, and download the standard Eunomia JSON package.

## Features

- **Online code editor**: Write eBPF programs and custom header files.
- **In-browser compiler**: Compile eBPF programs to WebAssembly without a remote server.
- **Example programs**: Load and learn from common eBPF examples.
- **Virtual file system**: View and manage the memory file system (MEMFS) that the compiler uses.
- **Package export**: Download the compiled `package.json` to run with the `ecli` tool.

## Setup and build

You can build the application with `pnpm` or Docker.

### Build with Docker

Run the Docker script to build the image and extract the static files:

```bash
./build-in-docker.sh
```

The script puts the built files in the `dist` directory. To start a local web server with Docker, use this command:

```bash
docker run -d -p 8080:80 --name my-ecli-webui ecli-webui
```

Then open `http://localhost:8080` in your browser.

### Build with pnpm

If you have Node.js and pnpm installed, you can run the application locally.

Install the dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Build the files for production:

```bash
pnpm run build
```

## Technology stack

- **Framework**: Vue 3 and Vite
- **Style**: Tailwind CSS
- **Compiler**: Emception (browser-based Clang/LLVM)
- **Editor**: Monaco Editor

For more data about the compiler architecture, read [online-compile.md](online-compile.md).
