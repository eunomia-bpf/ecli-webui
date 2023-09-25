<template>
    <div class="bg-white items-center rounded-md w-full h-14 flex justify-normal my-1 hover:bg-torinoko-50">
        <button class="w-full h-full flex items-center justify-start pl-3 whitespace-nowrap">
            <div class="pl-3 text-2xl">
                {{ props.name }}
            </div>
            <div class="flex items-center w-full justify-end mr-2 gap-3">


                <n-popover trigger="hover" v-if="!isConnected">
                    <template #trigger>
                        <div :class="stateClass">
                            <n-icon>
                                <PlugDisconnected20Regular />
                            </n-icon>
                        </div>
                    </template>
                    <span>Connection Lost</span>
                </n-popover>

                <n-popover trigger="hover">
                    <template #trigger>
                        <n-button text>
                            <n-icon size="20" color="#255359">
                                <Edit16Regular />
                            </n-icon>
                        </n-button>
                    </template>
                    <span>Edit</span>
                </n-popover>

                <n-popover trigger="hover">
                    <template #trigger>
                        <n-button text>
                            <n-icon size="20" color="#255359">
                                <X />
                            </n-icon>
                        </n-button>
                    </template>
                    <span>Delete</span>
                </n-popover>

            </div>
        </button>

    </div>
</template>

<script setup lang="ts">
import {
    Edit16Regular, ArrowClockwise16Regular,
    PlugDisconnected20Regular,
} from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { onMounted, computed, ref, watch, onBeforeUnmount } from 'vue'

let timer: number;

let props = defineProps<{
    name: string,
    url: string,
}>();

const emit = defineEmits<{
    (e: 'changeSelectedSrv', name: string): void
    (e: 'updateSelectedSrv', url: string): void
}>()

let isConnected = ref(false);

onMounted(() => {
    checkConnection();
    emit('changeSelectedSrv', props.name);
    timer = setInterval(checkConnection, 5000);
});

const checkConnection = async () => {
    try {
        const response = await fetch(`/api/task`);
        const data = await response.json();
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
