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
                <div class="row-span-1 bg-white flex flex-col rounded-md">
                    <ttl>
                        Server

                        <template #extra>
                            <n-popover trigger="hover">
                                <template #trigger>
                                    <n-button text>
                                        <n-icon size="20" color="#255359">
                                            <Add12Regular />
                                        </n-icon>
                                    </n-button>
                                </template>
                                <span>Add Server</span>
                            </n-popover>
                        </template>
                    </ttl>

                    <div class="w-full h-4 flex-grow overflow-y-auto rounded-md p-2 mt-2">
                        <ul class="w-full">
                            <li v-for="s in servers" :key="s.name">
                                <serverItem :name="s.name" :url="s.url" @changeSelectedSrv="updateOnServer" />
                                <!--TODO: ADD LISTEN TASK OP-->
                            </li>
                        </ul>
                    </div>
                </div>


                <div class="row-span-3 bg-white rounded-md flex flex-col">
                    <ttl>Program</ttl>
                    <div class="h-44 flex-grow overflow-auto rounded-md mb-1 mt-2 flex">
                        <ul class="list-none w-10 flex-grow">
                            <li v-for="t in servers[0].tasks" :key="t.name">
                                <progItem :name="t.name" :id="t.id" :status="t.status" @change-log-task="updateOnLogTask" />
                            </li>
                        </ul>

                    </div>


                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="col-span-4 rounded-md px-2 h-full flex flex-col">

                <div class="flex justify-start gap-3 h-10 items-center">

                    <upload />

                    <div class="flex justify-end gap-3 h-full w-full px-2 items-center">
                        <btn :disabled="downloadDisabled" class="bg-kamenozoki-300">Download</btn>
                        <btn :disabled="downloadDisabled" class="bg-kamenozoki-300">Run</btn>
                        <btn class="bg-kamenozoki-300">Compile</btn>
                    </div>
                </div>

                <!-- TABS -->
                <div class="h-18 rounded-t-md overflow-x-auto bg-white flex items-center">
                    <tab />
                </div>

                <!-- MONACO -->
                <monacoEditor class="bg-white px-1 rounded-b-md mb-1 h-3/5 flex-grow" v-model="editingValue"
                    :language="language" :hight-change="hightChange" width="100%" height="100%"
                    @editor-mounted="editorMounted" :read-only="editorRO" />

                <!-- CONSOLE -->
                <div class="bg-slate-50 w-full h-1/5 rounded-md flex flex-col">

                    <ttl>Console
                        <template #extra>
                            <n-popover trigger="hover">
                                <template #trigger>
                                    <n-button text>
                                        <n-icon size="20" color="#255359">
                                            <Archive48Regular />
                                        </n-icon>
                                    </n-button>
                                </template>
                                <span>Clean</span>
                            </n-popover>
                        </template>
                    </ttl>

                    <div class="w-full h-4 overflow-auto px-1 flex-grow rounded-md">
                        <csl :ctx="consoleCtx" at="test" />
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { reactive, ref, type Ref, watch, onBeforeUnmount, onMounted } from 'vue';
import monacoEditor from '../components/MonacoEditor.vue'
import btn from '../components/Button.vue'
import { Add12Regular, Archive48Regular } from '@vicons/fluent'
import ttl from '../components/Title.vue'
import csl from '../components/Console.vue'
import progItem from '../components/ProgItem.vue'
import serverItem from '../components/ServerItem.vue'
import upload from '../components/Upload.vue'
import tab from '../components/Tab.vue'
import { Server, Task } from '../components/serverInfo'
import { ecliApi } from '@/api'




let servers = reactive([new Server('Local', 'http://127.0.0.1:8527')]);



let consoleCtx: Ref<string> = ref(`clang-11: warning: argument unused during compilation: '--gcc-toolchain=/nix/store/1x1q5sqa0ilbi8fz7aayk02pjy5g7jhh-gcc-12.3.0' [-Wunused-command-line-argument]
skeleton/profiler.bpf.c:40:14: error: A call to built-in function '__stack_chk_fail' is not supported.
int BPF_PROG(fentry_XXX)
             ^
skeleton/profiler.bpf.c:94:14: error: A call to built-in function '__stack_chk_fail' is not supported.
int BPF_PROG(fexit_XXX)
             ^
2 errors generated.
make: *** [Makefile:204: profiler.bpf.o] Error 1`);



let editorRO: Ref<boolean> = ref(false);
let editingValue = ref(`
/* hello
world */`)

let language = ref('c')
let hightChange = ref<boolean>(false)

let downloadDisabled = ref<boolean>(true)

const editorMounted = (editor: any) => {
    console.log('editor load complete', editor)
}

let timer: number;

const updateTasksOfServers = async () => {
    servers.forEach(async (s) => {
        await s.updateTasks();
    });
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

let onServer = ref('');


const updateOnServer = (name: string) => {
    onServer.value = name;
    console.log(`Selected Server Updated -> ${onServer.value}`);
};

let onLogTask: Ref<number> = ref(0);

const updateOnLogTask = (id: number) => {
    onLogTask.value = id;
    console.log(`Selected Task Updated -> ${onLogTask.value}`);
};

const updateLogCtx = async () => {
    servers[0].tasks.forEach(async (t) => {
        if (t.id === onLogTask.value) {
            console.log(`Updating Log Context for ${t.name}`);
            ecliApi.getTaskLogByID({ id: t.id }).then((log) => {
                console.log(log);
                // consoleCtx.value = log[0;
            });
        }
    });
}

watch(() => onLogTask, updateLogCtx, { deep: true });

</script>

