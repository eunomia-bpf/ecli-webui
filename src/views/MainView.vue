<template>
    <div class="flex h-screen w-screen bg-customBg-100 p-3 relative">
        <div class="flex w-8 mr-2 items-start justify-center">
            <div class="whitespace-nowrap -rotate-90 transform mt-32 text-zinc-400 text-3xl">
                eunomia-bpf playground
            </div>

        </div>
        <div class="grid grid-cols-6 gap-2 w-full">

            <!-- LEFT SIDE -->
            <div class="col-span-2 grid grid-rows-4 w-full h-full gap-2">

                <!--Servers-->
                <ServerField :servers="servers" :on-server-id="onServer" @on-server-change="updateOnServer" />


                <div class="row-span-3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <ttl>Program</ttl>
                    <div class="h-44 flex-grow overflow-auto rounded-md mb-1 mt-2 flex">
                        <ul class="list-none w-10 flex-grow">
                            <li v-for="t in servers[0].tasks" :key="t.name">
                                <progItem :name="t.name" :id="t.id" :status="t.status"
                                    @change-log-task="updateOnLogTask" />
                            </li>
                        </ul>

                    </div>


                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="col-span-4 rounded-md px-2 h-full flex flex-col">

                <div class="flex justify-start gap-3 h-10 items-center w-full">

                    <upload @update-standby="updateStandbyBinary" @add-to-tab="addToTab" />

                    <div class="relative flex items-center">
                        <select v-model="selectedExample" @change="loadExample" class="appearance-none bg-sprout-100 border border-sprout-200 text-sprout-950 text-sm font-medium rounded-md px-3 py-2 pr-8 focus:outline-none focus:border-sprout-400 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                            <option value="" disabled selected>Load Example...</option>
                            <option v-for="ex in examplesList" :key="ex.name" :value="ex.name">{{ ex.name }}</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-sprout-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    
                    <btn @click="viewFileSystem" title="View Virtual File System">
                        <el-icon class="mr-1" size="16"><Folder20Regular /></el-icon>FS Info
                    </btn>

                    <div class="flex justify-end gap-3 h-full flex-grow px-2 items-center">
                        <btn :disabled="downloadDisabled" @click="downloadProgram">
                            <el-icon class="mr-1" size="16"><ArrowDownload20Regular /></el-icon>Download
                        </btn>
                        <btn :disabled="standbyBinary.program_data_buf == ''" @click="startProgram">
                            <el-icon class="mr-1" size="16"><Play20Regular /></el-icon>Run
                        </btn>
                        <btn @click="compileProgram">
                            <el-icon class="mr-1" size="16"><Wrench20Regular /></el-icon>Compile
                        </btn>
                    </div>
                </div>

                <!--EDITOR-->
                <EditorField :tabs="tabs" />

                <!-- CONSOLE -->
                <div class="bg-slate-100 w-full h-2/6 rounded-xl shadow-inner border border-slate-200 flex flex-col overflow-hidden">

                    <ttl>Console
                        <template #extra>
                            <el-popover trigger="hover">
                                <template #reference>
                                    <button class="cursor-pointer bg-transparent hover:bg-slate-200 p-1 rounded-md transition-colors" @click="cleanConsole">
                                        <el-icon size="20" color="#255359">
                                            <Archive48Regular />
                                        </el-icon>
                                    </button>
                                </template>
                                <div class="text-center">Clean Console</div>
                            </el-popover>
                        </template>
                    </ttl>

                    <div ref="consoleContainer" class="w-full h-4 overflow-auto px-1 flex-grow rounded-md pb-2">
                        <csl :ctx="consoleCtx" at="logAt" />
                    </div>

                </div>
            </div>
        </div>

    </div>
    
    <!-- Virtual FS Modal -->
    <el-dialog v-model="showFsModal" title="Virtual File System (MEMFS)" width="50%" class="rounded-xl">
        <div class="max-h-96 overflow-y-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100 text-slate-600 text-sm">
                        <th class="p-2 border-b border-slate-200">Name</th>
                        <th class="p-2 border-b border-slate-200 w-24">Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in fsFiles" :key="file.name" class="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                        <td class="p-2 text-slate-800 flex items-center gap-2">
                            <el-icon size="16" :color="file.isDir ? '#da8b5d' : '#6f9052'">
                                <component :is="file.isDir ? 'Folder20Regular' : 'Document20Regular'" />
                            </el-icon>
                            {{ file.name }}
                        </td>
                        <td class="p-2 text-slate-500 text-sm">{{ file.isDir ? 'Directory' : 'File' }}</td>
                    </tr>
                    <tr v-if="fsFiles.length === 0">
                        <td colspan="2" class="p-4 text-center text-slate-400">FS is empty or uninitialized</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </el-dialog>
</template>


<script setup lang="ts">
import { ecliApi } from "@/api";
import ServerField from "@/components/ServerField.vue";
import { 
    Archive48Regular,
    ArrowDownload20Regular,
    Play20Regular,
    Wrench20Regular,
    Folder20Regular,
    Document20Regular
} from "@vicons/fluent";
import Emception from "emception/emception.js"; // TODO: add a declare file for emception
import {
    type Ref,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    computed,
    watch,
    nextTick
} from "vue";
import EditorField from "../components/EditorField.vue";
import upload from "../components/FileUpload.vue";
import btn from "../components/GeneralBtn.vue";
import ttl from "../components/HeadTitle.vue";
import progItem from "../components/ProgItem.vue";
import csl from "../components/TheConsole.vue";
import { Server } from "../components/serverInfo";
onMounted(async () => {
    try {
        // Clear all IndexedDB databases safely
        try {
            await new Promise((resolve, reject) => {
                window.indexedDB.databases().then(dbs => {
                    let count = dbs.length;
                    if (count === 0) return resolve(undefined);
                    for (const db of dbs) {
                        if (db.name) {
                            let req = window.indexedDB.deleteDatabase(db.name);
                            req.onsuccess = req.onerror = () => {
                                count--;
                                if (count === 0) resolve(undefined);
                            };
                        } else {
                            count--;
                            if (count === 0) resolve(undefined);
                        }
                    }
                }).catch(resolve);
            });
            consoleCtx.value.push("Cleared IndexedDB cache.");
        } catch(e) {}

        const emception = new Emception();
        emception.onstdout = (s) => consoleCtx.value.push(s);
        emception.onstderr = (s) => consoleCtx.value.push(s);
        try {
            await emception.init();
        } catch(e) {
            consoleCtx.value.push("Init throwed! " + (e.stack || e));
            throw e;
        }
        (window as any).emception = emception;
        consoleCtx.value.push("Emception initialized.");
        
        consoleCtx.value.push("Fetching system BPF headers...");
        try {
            if (emception.fileSystem && emception.fileSystem.FS) {
                try { emception.fileSystem.FS.mkdir("/bpf"); } catch(e){}
            } else {
                try { emception.fileSystem.mkdirTree("/bpf"); } catch(e){}
            }
            const headers = [
                "/vmlinux.h",
                "/bpf/bpf_core_read.h",
                "/bpf/bpf_endian.h",
                "/bpf/bpf_helper_defs.h",
                "/bpf/bpf_helpers.h",
                "/bpf/bpf_tracing.h",
            ];
            for (const h of headers) {
                try {
                    const res = await fetch("/bpf_headers" + h);
                    if (res.ok) {
                        const content = await res.text();
                        emception.fileSystem.writeFile(h, content);
                    }
                } catch(e) {
                    console.error("Failed to fetch", h, e);
                }
            }
            consoleCtx.value.push("Loaded BPF headers.");
        } catch(e) {
            console.error("Error loading headers", e);
        }
    } catch (e) {
        consoleCtx.value.push("Emception initialization failed: " + e);
        console.error("Emception init error:", e);
    }
    
    // Load examples list
    try {
        const res = await fetch('/examples.json');
        if (res.ok) {
            examplesList.value = await res.json();
        }
    } catch (e) {
        console.error("Failed to load examples", e);
    }
});

const servers = reactive([new Server("Local", "http://127.0.0.1:8527")]);

import type { StartTaskRequest } from "../api-client/api";

const standbyBinary: Ref<StartTaskRequest> = ref({
    program_data_buf: "",
    program_type: "wasm",
});

const tabs: Ref<Map<string, string>> = ref(new Map());

const updateStandbyBinary = (r: StartTaskRequest) => {
    standbyBinary.value = r;
    console.log("standby binary ready");
};

const addToTab = async (n: string, c: string) => {
    // ?
    console.log(`name: ${n}\nctx: ${c}`);
    tabs.value.set(n, c);
    console.log(`sent ${n} into editor`);
};

provide("servers", servers);

const initialConsoleValue = ["select a program to view logs"];

const consoleCtx: Ref<string[]> = ref(initialConsoleValue);
const consoleContainer = ref<HTMLElement | null>(null);

watch(consoleCtx, async () => {
    await nextTick();
    if (consoleContainer.value) {
        consoleContainer.value.scrollTop = consoleContainer.value.scrollHeight;
    }
}, { deep: true });

const cleanConsole = async () => {
    consoleCtx.value.splice(0, consoleCtx.value.length, "select a program to view logs");
};

// --- Examples & FS Viewer ---
const examplesList = ref<Array<{name: string, files: string[]}>>([]);
const selectedExample = ref('');

const loadExample = async () => {
    const ex = examplesList.value.find(e => e.name === selectedExample.value);
    if (!ex) return;
    
    // Clear UI tabs
    tabs.value.clear();
    
    // Clean MEMFS of any custom files before loading new ones
    if ((window as any).emception) {
        const FS = (window as any).emception.fileSystem.FS;
        if (FS) {
            try {
                const items = FS.readdir('/');
                for (const item of items) {
                    if (item !== '.' && item !== '..' && item !== 'vmlinux.h') {
                        const stat = FS.stat('/' + item);
                        if (!FS.isDir(stat.mode)) {
                            FS.unlink('/' + item);
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to clean MEMFS", e);
            }
        }
    }
    
    for (const file of ex.files) {
        try {
            const res = await fetch(`/examples/${ex.name}/${file}`);
            if (res.ok) {
                const text = await res.text();
                addToTab(file, text);
            }
        } catch (e) {
            console.error(`Failed to load file ${file} from example ${ex.name}`);
        }
    }
    consoleCtx.value.push(`Loaded example ${ex.name} into editor.`);
};

const showFsModal = ref(false);
const fsFiles = ref<{name: string, isDir: boolean}[]>([]);

const viewFileSystem = () => {
    if (!(window as any).emception) {
        alert("Virtual file system not initialized yet.");
        return;
    }
    const emception = (window as any).emception;
    const FS = emception.fileSystem.FS;
    if (!FS) {
        alert("FS object not available");
        return;
    }
    try {
        const items = FS.readdir('/');
        fsFiles.value = items.filter((i: string) => i !== '.' && i !== '..').map((i: string) => {
            const stat = FS.stat('/' + i);
            return {
                name: i,
                isDir: FS.isDir(stat.mode)
            };
        }).sort((a: any, b: any) => (a.isDir === b.isDir ? 0 : a.isDir ? -1 : 1));
        showFsModal.value = true;
    } catch (e) {
        console.error(e);
        alert("Failed to read virtual file system");
    }
};
// ----------------------------

const downloadDisabled = computed(() => standbyBinary.value.program_data_buf === "");

const downloadProgram = () => {
    if (downloadDisabled.value) return;
    try {
        const decodedStr = window.atob(standbyBinary.value.program_data_buf);
        const blob = new Blob([decodedStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'package.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        consoleCtx.value.push("Downloaded package.json");
    } catch (e) {
        consoleCtx.value.push("Download failed: " + e);
        console.error("Download error:", e);
    }
};

let timer: number;

const updateTasksOfServers = async () => {
    for (const s of servers) {
        await s.updateTasks();
    }
};

// update Tasks List
watch(() => servers, updateTasksOfServers, { deep: true });

onBeforeUnmount(() => {
    clearInterval(timer);
});

onMounted(() => {
    updateTasksOfServers();
    timer = setInterval(updateTasksOfServers, 5000);
});

// handle program

const onServer: Ref<number> = ref(0);

const updateOnServer = (id: number) => {
    onServer.value = id;
};

const onLogTask: Ref<number> = ref(0);

const updateOnLogTask = (id: number) => {
    onLogTask.value = id;
    console.log(`Selected Task Updated -> ${onLogTask.value}`);
};

const updateLogCtx = async () => {
    for (const t of servers[0].tasks) {
        if (t.id === onLogTask.value) {
            console.log(`Updating Log Context for ${t.name}`);
            ecliApi.getTaskLogByID({ id: t.id }).then((log) => {
                const logCtx = log.data.map((l) => {
                    const logCtx = l.log;
                    return logCtx.log;
                });

                // flush console display
                consoleCtx.value = logCtx;

                // TODO: follow log
            });
        }
    }
};
const startProgram = async () => {
    console.log("starting program");
    await ecliApi.startTask(standbyBinary.value);
    console.log("program started");
};

const compileProgram = async () => {
    consoleCtx.value.push("Starting compilation...");
    
    if (!(window as any).emception) {
        consoleCtx.value.push("Emception not initialized yet.");
        return;
    }
    const emception = (window as any).emception;
    
    for (const [name, content] of tabs.value.entries()) {
        try {
            emception.fileSystem.writeFile('/' + name, content);
        } catch (e) {
            consoleCtx.value.push(`Error writing file ${name}: ${e}`);
            console.error(`Error writing file ${name}:`, e);
            return;
        }
    }
    
    const cFiles = Array.from(tabs.value.keys()).filter(f => f.endsWith('.c') || f.endsWith('.cpp'));
    if (cFiles.length === 0) {
        consoleCtx.value.push("No .c files found to compile.");
        return;
    }
    const mainC = cFiles[0];
    
    consoleCtx.value.push(`Compiling ${mainC}...`);
    
    try {
        const result = await emception._run_process(['/usr/bin/clang', '-g', '-O2', '-target', 'bpf', '-I/', '-c', '/' + mainC, '-o', '/main.bpf.o'], {
            print: (s: string) => consoleCtx.value.push(s),
            printErr: (s: string) => consoleCtx.value.push(s),
            cwd: "/"
        });
        consoleCtx.value.push(`Compilation exit code: ${result.returncode}`);
        
        if (result.returncode === 0) {
            const out = emception.fileSystem.readFile('/main.bpf.o');
            
            // convert Uint8Array to base64
            let binary = '';
            for (let i = 0; i < out.byteLength; i++) {
                binary += String.fromCharCode(out[i]);
            }
            const base64 = window.btoa(binary);
            
            const eunomiaPkg = {
                bpf_object: base64,
                bpf_object_size: out.length,
                meta: {
                    bpf_skel: {
                        data_sections: [],
                        maps: [],
                        progs: []
                    },
                    eunomia_version: "0.1.0"
                }
            };
            const eunomiaPkgStr = JSON.stringify(eunomiaPkg);
            const eunomiaPkgBase64 = window.btoa(eunomiaPkgStr);
            
            standbyBinary.value = {
                program_data_buf: eunomiaPkgBase64,
                program_type: "wasm",
            };
            
            consoleCtx.value.push("Compilation successful! Program is ready to run.");
        } else {
            consoleCtx.value.push(`Compilation failed. Stderr: ${result.stderr}`);
        }
    } catch (e) {
        consoleCtx.value.push(`Compilation failed with error: ${e}`);
    }
};

watch(onLogTask, updateLogCtx, { deep: true });
</script>

