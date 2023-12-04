<template>
    <div class="bg-white items-center rounded-md w-full h-14 flex justify-normal my-1 hover:bg-torinoko-50">
        <button class="w-full h-full flex items-center justify-start pl-3 whitespace-nowrap">
            <div class="pl-3 text-2xl">
                {{ props.name }}
            </div>
            <div class="flex items-center w-full justify-end mr-2 gap-3">

                <el-popover trigger="hover" v-if="!isConnected">
                    <template #reference>
                        <div :class="stateClass">
                            <el-icon>
                                <PlugDisconnected20Regular />
                            </el-icon>
                        </div>
                    </template>
                    <div class="text-center">Connection Lost</div>
                </el-popover>

                <el-popover trigger="hover">
                    <template #reference>
                        <button class="flex items-center">
                            <el-icon size="20" color="#255359">
                                <Edit16Regular />
                            </el-icon>
                        </button>
                    </template>

                    <div class="text-center">Edit Server</div>

                </el-popover>

                <el-popover trigger="hover">
                    <template #reference>
                        <button class="flex items-center">
                            <el-icon size="20" color="#255359">
                                <X />
                            </el-icon>
                        </button>
                    </template>
                    <div class="text-center">Delete Server</div>
                </el-popover>

            </div>
        </button>

    </div>
</template>

<script setup lang="ts">
import {
    Edit16Regular,
    PlugDisconnected20Regular,
} from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { onMounted, computed, ref, watch, onBeforeUnmount } from 'vue'

let timer: number;

let props = defineProps<{
    id: number,
    name: string,
    url: string,
}>();

const emit = defineEmits<{
    (e: 'changeSelectedSrv', id: number): void
    (e: 'updateSelectedSrv', url: string): void
}>()

let isConnected = ref(false);

onMounted(() => {
    checkConnection();
    emit('changeSelectedSrv', props.id);
    timer = setInterval(checkConnection, 5000);
});

import { ecliApi } from '@/api'

const checkConnection = async () => {
    try {
        const resp = await ecliApi.getTaskList();
        const data = resp.data;
        isConnected.value = "tasks" in data;
        console.log(data)
    } catch (error) {
        isConnected.value = false;
    }
};
// ?url=${encodeURIComponent(props.url)}
watch(() => props.url, () => {
    clearInterval(timer);
    checkConnection();
    timer = setInterval(checkConnection, 2000);
});

onBeforeUnmount(() => {
    clearInterval(timer);
});

let baseStateClass = "px-3 text-xl rounded-xl py-2 items-center flex justify-center";

const stateClass = computed(() => {
    return isConnected.value ? baseStateClass + " bg-transparent" : baseStateClass + " bg-red-ribbon-100";
});


</script>
