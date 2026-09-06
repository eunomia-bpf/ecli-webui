# Eunomia-bpf Playground 在线编译实现详解

本文档事无巨细地记录了 `eunomia-bpf` 网页版 Playground 中，如何在脱离后端服务器的情况下，完全在浏览器端（纯前端）实现 eBPF 程序的在线编译、打包和下载功能。

## 1. 核心技术栈：基于 WASM 的浏览器端 Clang

在线编译的核心是借助 **Emception** 库。Emception 将 LLVM/Clang 工具链通过 Emscripten 交叉编译为了 WebAssembly (WASM)，使其可以直接跑在浏览器的 JavaScript 运行环境中。

在本项目中，前端在页面挂载时初始化 Emception 实例：
- **Stdout / Stderr 接管**：将 Emception 的标准输出和标准错误输出拦截，绑定到前端的 `consoleCtx` 中，从而在 UI 的 Console 组件里实时展示编译日志。
- **MEMFS（内存文件系统）**：Emception 依赖浏览器提供的内存虚拟文件系统，所有的读取头文件、写入源代码、输出 `.o` 目标文件都在这个虚拟文件系统中进行。

## 2. 虚拟文件系统 (MEMFS) 构建与依赖注入

由于 C 语言编译强依赖文件系统中的头文件，在发起编译前，我们必须在浏览器中“伪造”一个完整的包含 BPF 依赖的文件环境。

### 2.1 BPF 系统级头文件注入
在页面加载（`onMounted`）时，程序会通过 `fetch` 请求向前端静态资源服务器拉取必要的基础系统头文件，并将它们原封不动地写入 MEMFS 的相应目录：
- `/vmlinux.h`（包含完整的 Linux 内核结构体定义，用于 CO-RE）
- `/bpf/bpf_core_read.h`
- `/bpf/bpf_endian.h`
- `/bpf/bpf_helper_defs.h`
- `/bpf/bpf_helpers.h`
- `/bpf/bpf_tracing.h`

### 2.2 用户态代码注入
当用户点击 **Compile** 按钮时，程序会遍历当前代码编辑器 (`tabs` 对象) 中打开的所有文件（包括 `.c` 源码和附加的自定 `.h` 文件），并通过 `emception.fileSystem.writeFile` 将它们实时写入 MEMFS 的根目录 `/` 中。

> **防踩坑设计**：在加载 Example 时（从远端 fetch 多文件），我们加入了全屏加载动画拦截。由于 fetch 是异步的，若不等待所有头文件写入 MEMFS 完毕便执行编译，Clang 会报 `file not found` 错误。引入 `isLoadingExample` 状态就是为了保证文件系统准备完毕的强时序性。

## 3. Clang 编译执行链路

所有文件就绪后，前端通过 `emception._run_process()` API 唤起虚拟出的 `/usr/bin/clang`。

### 3.1 核心编译参数 (Compiler Flags)
我们使用的编译命令与在本地 Linux 终端使用 Clang 编译 BPF 对象完全一致：
```bash
/usr/bin/clang -g -O2 -target bpf -D__TARGET_ARCH_x86 -I/ -c /<main.bpf.c> -o /main.bpf.o
```
其中，各个参数的意义与在 Web 端的作用如下：
- `-target bpf`：指示 LLVM 生成 BPF 字节码，而不是当前机器（或 WebAssembly）架构的二进制。
- `-O2` 和 `-g`：开启常规优化并包含调试信息。
- `-I/`：将 MEMFS 的根目录 `/` 加入头文件搜索路径，使得源码中可以通过 `#include "vmlinux.h"` 找到文件。
- `-D__TARGET_ARCH_x86`：**【关键修复】** 由于 `bpf_tracing.h` 中的诸多钩子宏（如 `BPF_KRETPROBE`、`PT_REGS_RC`）需要知晓目标 CPU 架构才能正确推导寄存器宏，我们强制传入 x86 的宏定义，否则在宏展开阶段便会抛出 `_Pragma("GCC error")` 中断编译。

### 3.2 源码兼容性适配
由于我们使用的 `/vmlinux.h` 提取自较新的 Linux 内核：
- 原本在老内核里 `struct filename` 定义为包含 `const char* name` 的指针成员。
- 在新内核中被优化为了行内数组 `const char iname[168]`。
- 我们在示例代码中对这些 CO-RE 操作进行了前置适配，例如将 `fentry-link` 的 `name->name` 更改为 `name->iname`，并将 `kprobe-link` 的解引用操作调整为 `(const char *)name + bpf_core_field_offset(name->iname)` 的地址偏移运算，确保编译能顺利通过严苛的静态检查。

## 4. 产物打包与生成 (Eunomia Package)

当 Clang 以退出码 `0` (Success) 结束编译时，会在 MEMFS 的根目录产出目标文件 `/main.bpf.o`。随后进入 Eunomia 特有的打包流程：

1. **二进制读取**：通过 `emception.fileSystem.readFile('/main.bpf.o')` 将 Wasm 内存中产生的 ELF 二进制文件读取为 JS 的 `Uint8Array` 字节流。
2. **Base64 编码**：将这段字节流按字节转换为 ASCII 字符串，随后使用浏览器的 `window.btoa` 进行 Base64 编码。
3. **JSON 外壳组装**：按照 `eunomia-bpf` 工具链规范，构建骨架 JSON 文件（即平常使用 ecc 编译出的 `package.json`），其中 `bpf_object` 字段承载上方转换完成的 Base64 字符串，并附加元数据：
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
4. **最终态转化**：将上述打包好的 JSON 对象序列化为字符串，再进行一次整体 Base64 编码，存入 Vue 响应式的 `standbyBinary.program_data_buf` 中。

## 5. 产物分发与下载

当 `standbyBinary` 准备就绪时，界面右上角的 **Download** 按钮自动解锁亮起。
用户点击下载时：
1. 触发 `downloadProgram` 逻辑。
2. 将 `standbyBinary.program_data_buf` 用 `window.atob` 解码回 JSON 字符串文本。
3. 利用 HTML5 的 `Blob` 对象创建文件流（`type: 'application/json'`）。
4. 通过 `URL.createObjectURL` 生成临时链接，并动态创建一个 `<a download="package.json">` 标签模拟点击，唤起浏览器下载保存弹窗。
5. 最终得到一个可被 `ecli` 直接运行的标准打包文件，彻底实现了无后端闭环。
