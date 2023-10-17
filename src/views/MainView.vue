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
                        <btn :disabled="downloadDisabled" class="bg-kamenozoki-300" @click="startProgram">Run</btn>
                        <btn class="bg-kamenozoki-300">Compile</btn>
                    </div>
                </div>

                <!--EDITOR-->
                <EditorField />

                <!-- CONSOLE -->
                <div class="bg-slate-50 w-full h-2/6 rounded-md flex flex-col">

                    <ttl>Console
                        <template #extra>
                            <n-popover trigger="hover">
                                <template #trigger>
                                    <n-button text @click="cleanConsole">
                                        <n-icon size="20" color="#255359">
                                            <Archive48Regular />
                                        </n-icon>
                                    </n-button>
                                </template>
                                <span>Clean</span>
                            </n-popover>
                        </template>
                    </ttl>

                    <div class="w-full h-4 overflow-x-auto px-1 flex-grow rounded-md">
                        <csl :ctx="consoleCtx" at="logAt" />
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { reactive, provide, ref, type Ref, watch, onBeforeUnmount, onMounted } from 'vue';
import btn from '../components/GeneralBtn.vue'
import { Archive48Regular } from '@vicons/fluent'
import ttl from '../components/HeadTitle.vue'
import csl from '../components/TheConsole.vue'
import progItem from '../components/ProgItem.vue'
import upload from '../components/FileUpload.vue'
import { Server, } from '../components/serverInfo'
import { ecliApi } from '@/api'
import EditorField from '../components/EditorField.vue';
import ServerField from '@/components/ServerField.vue';
import init_clang_module from '../../wasm-bin/clang';

onMounted(async () => {
    let mod = await init_clang_module();
    // let mod = await create_ffmpeg_module();
    console.log("clang module loaded");
    // console.log(mod._main(["2"], ["-v"]));
    // console.log(mod._malloc(2));
    // console.log(mod._add(2, 3));
});


let servers = reactive([new Server('Local', 'http://127.0.0.1:8527')]);

provide('servers', servers);

const initialConsoleValue = ['select a program to view logs'];

let consoleCtx: Ref<string[]> = ref(initialConsoleValue);

const cleanConsole = async () => {
    consoleCtx.value = initialConsoleValue;
}

let downloadDisabled = ref<boolean>(true)

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

let onServer: Ref<number> = ref(0);

const updateOnServer = (id: number) => {
    onServer.value = id;
}

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
                // log.data[0] : {
                //     cursor: number;
                //     log: { log: string, timestamp: num, log_type: string }
                // }

                let logCtx = log.data.map((l) => {
                    let logCtx = l.log;
                    return logCtx.log;
                });

                // flush console display
                consoleCtx.value = logCtx;

                // TODO: follow log
            });
        }
    });
}

const startProgram = async () => {
    console.log('starting program');
    // await ecliApi.startProgram({ server: servers[0].url, program: editingValue.value });
    // console.log('program started');
}

watch(onLogTask, updateLogCtx, { deep: true });

</script>
