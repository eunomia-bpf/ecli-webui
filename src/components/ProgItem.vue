<template>
    <div class="w-fit h-fit px-2">
        <div class="bg-white items-center rounded-md w-fit h-16 flex justify-normal my-1
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

                <div class="px-3 text-xl rounded-xl bg-moss-100 py-1" v-if="!isPaused">
                    <p class="text-empress-600">
                        Running
                    </p>
                </div>
                <div class="px-3 text-xl rounded-xl bg-tumbleweed-200 py-1 mr-1" v-if="isPaused">
                    <p class="text-empress-600">
                        Paused
                    </p>
                </div>


                <n-popover trigger="hover">
                    <template #trigger>
                        <btn @click="pauseOrResumeTask" text>
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
                        <btn @click="emits('changeLogTask', props.id)" text>
                            <n-icon size="20" color="#255359">
                                <Open16Regular />
                            </n-icon>
                        </btn>
                    </template>
                    <span>Log</span>
                </n-popover>


                <n-popover trigger="hover">
                    <template #trigger>
                        <btn text @click="stopTask">
                            <n-icon size="20" color="#255359">
                                <X />
                            </n-icon>
                        </btn>
                    </template>
                    <span>Stop</span>
                </n-popover>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Open16Regular, Pause16Regular, Play16Regular } from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { computed, ref } from 'vue'
import btn from './Button.vue'
import { ecliApi } from '@/api'
import { TaskStatus } from './serverInfo'

// {"tasks":[{"status":"running","id":1,"name":"bpf-program-1693148745"}]}


let props = defineProps<{
    name: string,
    id: number,
    status: TaskStatus,
}>()

let emits = defineEmits<{
    (e: 'changeLogTask', id: number): void
}>()

let isUserPaused = ref(props.status === TaskStatus.Paused);

const pauseOrResumeTask = async () => {
    isUserPaused.value = !isUserPaused.value;
    if (isUserPaused.value) {
        await ecliApi.resumeTaskByID({ id: props.id });
        console.log('try resuming task ' + props.id);
    } else {
        console.log('try pausing task ' + props.id);
        await ecliApi.pauseTaskByID({ id: props.id });
    }
};

let isPaused = computed(() => props.status === TaskStatus.Paused);

const stopTask = async () => {
    console.log('try stopping task ' + props.id);
    await ecliApi.stopTaskByID({ id: props.id });
}

</script>
