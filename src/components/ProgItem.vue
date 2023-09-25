<template>
    <div class="bg-white items-center rounded-md w-full h-16 flex justify-normal my-1
         hover:bg-torinoko-50 pl-3 whitespace-nowrap">
        <div class="pl-2 bg-moss-200 rounded-lg w-1 h-4">
        </div>
        <div class="pl-3 text-2xl">
            {{ props.id }}
        </div>

        <div class="pl-3 pr-1 text-2xl">
            {{ props.name }}
        </div>


        <div class="flex items-center w-full justify-end mr-2 gap-3">

            <div class="px-3 text-xl rounded-xl bg-moss-100 py-1">Running</div>

            <n-popover trigger="hover">
                <template #trigger>
                    <btn @click="isPaused = !isPaused" text>
                        <n-icon size="20" color="#255359">
                            <Pause16Regular v-if="!isPaused" />
                            <Play16Regular v-if="isPaused" />
                        </n-icon>
                    </btn>
                </template>
                <span>Pause / Resume</span>
            </n-popover>

            <n-popover trigger="hover">
                <template #trigger>
                    <btn text>
                        <n-icon size="20" color="#255359">
                            <Open16Regular />
                        </n-icon>
                    </btn>
                </template>
                <span>Log</span>
            </n-popover>


            <n-popover trigger="hover">
                <template #trigger>
                    <btn text>
                        <n-icon size="20" color="#255359">
                            <X />
                        </n-icon>
                    </btn>
                </template>
                <span>Stop</span>
            </n-popover>

        </div>
    </div>
</template>

<script setup lang="ts">
import { Open16Regular, Pause16Regular, Play16Regular } from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { computed } from 'vue'
import btn from './Button.vue'
import { ecliApi } from '@/api'
import { TaskStatus } from './serverInfo'

// {"tasks":[{"status":"running","id":1,"name":"bpf-program-1693148745"}]}


let props = defineProps<{
    name: string,
    id: number,
    status: TaskStatus,
}>()

let isPaused = computed(() => {
    return props.status === TaskStatus.Paused;
});

// const stopTask = async () => {
//     try {
//         ecliApi.stopTaskByID({ simpleIdRequest: { id: props.id } });
//     } catch (e) {
//         console.log(e);
//     }
// }

</script>
