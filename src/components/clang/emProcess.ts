import process from "./process";
export default class EmProcess extends process {
    _module = null;
    _memory = null;

    _print = (...args: string[]) => console.log(...args);
    _printErr = (...args: string[]) => console.warn(...args);
    ready: Promise<void>;
    then: (...args: any[]) => Promise<this>;

    constructor(Module: any, onrunprocess: any, onprint: any, onprintErr: any, opts: any) {
        super({
            onrunprocess,
            onprint,
            onprintErr,
        });


        this.ready = this.#init(Module, FS, { onrunprocess, ...opts });

        const promise = this.ready.then(() => {
            delete (this as any).then;
            return this;
        });
        this.then = (...args) => promise.then(...args);
    }

    #init = async (Module: any, FS: any, opts: any) => {
        const fsroot = FS && {
            ROOT: {
                type: "PROXYFS",
                opts: {
                    root: "/",
                    fs: FS,
                },
            }
        };
        this._module = await new Module({
            ...opts,
            ...fsroot,
            noInitialRun: true,
            noExitRuntime: true,
            print: (...args: string[]) => this._print(...args),
            printErr: (...args: string[]) => this._printErr(...args),
        });
        this._memory = this._module.HEAPU8.slice();

        if (fsroot) {
            // Do not cache nodes belonging to the PROXYFS mountpoint.
            const hashAddNode = this._module.FS.hashAddNode;
            this._module.FS.hashAddNode = (node: any) => {
                if (node.mount.mountpoint === "/") return;
                hashAddNode(node);
            }
        }

        this.#addErorCodeToErrnoError();
    }
    #addErorCodeToErrnoError = () => {
        const FS = this._module.FS;
        const ERRNO_CODES = Object.fromEntries(
            Object.entries(this._module.ERRNO_CODES)
                .map(([k, v]) => [v, k])
        );
        Object.defineProperty(FS.ErrnoError.prototype, "code", {
            get: function () {
                return ERRNO_CODES[this.errno];
            }
        });
    }

    get FS() {
        return this._module.FS;
    }

    _callMain(argc: string[], argv: string[]) {
        return this._module._main(argc, argv);
    }
    exec(args: any, opts = {}) {
        if ((typeof args) === "string") args = args.split(/ +/g);

        // Clang's driver uses global state, and this might not be the first time we run the module.
        // Reinitialize the memory to its initial state to reset the global state.
        // TODO: Is this safe? Is this missing some other source of state? wasm globals? JS?
        this._module.HEAPU8.fill(0);
        this._module.HEAPU8.set(this._memory);

        // Allocate argv
        const argc = args.length;
        const argv = this._module._malloc((argc + 1) * 4);
        const allocs = [argv];
        for (let i = 0; i < argc; i++) {
            const p = this._module.HEAP32[(argv >> 2) + i] = this._module.allocateUTF8(args[i]);
            allocs.push(p);
        }
        this._module.HEAP32[(argv >> 2) + argc] = 0;

        let returncode = 0;
        const stdout: string[] = [];
        const stderr: string[] = [];

        this._print = (...args) => {
            this.onprint(...args);
            opts.print && opts.print(...args);
            stdout.push(...args);
        };
        this._printErr = (...args) => {
            this.onprintErr(...args);
            opts.printErr && opts.printErr(...args);
            stderr.push(...args);
        };

        try {
            if (opts.cwd) this.cwd = opts.cwd;
            returncode = this._module._main(argc, argv);
        } catch (e) {
            if (typeof e === "number") {
                returncode = -84;
            } else if ("status" in e) {
                returncode = e.status;
            } else {
                returncode = -42;
            }
        } finally {
            allocs.forEach(p => this._module._free(p));
        }

        return {
            returncode,
            stdout: stdout.join("\n"),
            stderr: stderr.join("\n"),
        }
    }

};
