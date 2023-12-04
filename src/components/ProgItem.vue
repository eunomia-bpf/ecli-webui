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

                <div class="px-3 text-xl rounded-xl bg-moss-100 py-1" v-if="!pausedStatus">
                    <p class="text-empress-600">
                        Running
                    </p>
                </div>
                <div class="px-3 text-xl rounded-xl bg-tumbleweed-200 py-1 mr-1" v-if="pausedStatus">
                    <p class="text-empress-600">
                        Paused
                    </p>
                </div>


                <el-popover trigger="hover">
                    <template #reference>
                        <btn @click="pauseOrResumeTask" text>
                            <el-icon size="20" color="#255359">
                                <Pause16Regular v-if="!pausedStatus" />
                                <Play16Regular v-if="pausedStatus" />
                            </el-icon>
                        </btn>
                    </template>
                    <div class="text-center">Pause / Resume</div>
                </el-popover>

                <el-popover trigger="hover">
                    <template #reference>
                        <btn @click="emits('changeLogTask', props.id)" text>
                            <el-icon size="20" color="#255359">
                                <Open16Regular />
                            </el-icon>
                        </btn>
                    </template>
                    <div class="text-center">Log</div>
                </el-popover>


                <el-popover trigger="hover">
                    <template #trigger>
                        <btn text @click="stopTask">
                            <el-icon size="20" color="#255359">
                                <X />
                            </el-icon>
                        </btn>
                    </template>
                    <span>Stop</span>
                </el-popover>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Open16Regular, Pause16Regular, Play16Regular } from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { computed, onMounted, ref, } from 'vue'
import btn from './GeneralBtn.vue'
import { ecliApi } from '@/api'
import { TaskStatus } from '@/api-client'

// {"tasks":[{"status":"running","id":1,"name":"bpf-program-1693148745"}]}


let props = defineProps<{
    name: string,
    id: number,
    status: TaskStatus,
}>()

let emits = defineEmits<{
    (e: 'changeLogTask', id: number): void
}>()

let rawPausedStatus = ref(props.status === TaskStatus.Paused);

let pausedStatus = computed({
    get() {
        return rawPausedStatus.value;
    },
    set(n) {
        rawPausedStatus.value = n;
    }
})


onMounted(() => {
    console.log(props.id + " now " + pausedStatus.value);
});

const pauseOrResumeTask = async () => {

    console.log("task with id: " + props.id + " is paused: " + pausedStatus.value);
    if (pausedStatus.value) {
        await ecliApi.resumeTaskByID({ id: props.id });
        console.log('resuming task ' + props.id);
    } else {
        await ecliApi.pauseTaskByID({ id: props.id });
        console.log('pausing task ' + props.id);
    }
    pausedStatus.value = !pausedStatus.value;
};


const stopTask = async () => {
    console.log('try stopping task ' + props.id);
    await ecliApi.stopTaskByID({ id: props.id });
}

</script>
