<template>
    <div class="bg-white items-center rounded-md w-full h-14 flex justify-normal my-1 hover:bg-torinoko-50">
        <button class="w-full h-full flex items-center justify-start pl-3 whitespace-nowrap">
            <div class="pl-3 text-2xl">
                <slot></slot>
            </div>
            <div class="flex items-center w-full justify-end mr-2 gap-3">

                <div :class="stateClass">
                    <n-icon>
                        <PlugDisconnected20Regular v-if="isDisconnected" />
                    </n-icon>
                </div>


                <n-popover trigger="hover" v-if="isDisconnected">
                    <template #trigger>
                        <n-button text>
                            <n-icon size="20" color="#255359">
                                <ArrowClockwise16Regular />
                            </n-icon>
                        </n-button>
                    </template>
                    <span>Reconnect</span>
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
import { Edit16Regular, ArrowClockwise16Regular, PlugDisconnected20Regular, PlugConnected20Regular } from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { computed } from 'vue'
import { State } from '../components/serverState'


let props = defineProps<{
    state: State,
}>();

let baseClassStr = "px-3 text-xl rounded-xl py-2 items-center flex justify-center";

let stateClass = computed(() => {
    switch (props.state) {
        case State.Connected:
            return baseClassStr + " bg-transparent";
        case State.Disconnected:
            return baseClassStr + " bg-red-ribbon-100";
        case State.Connecting:
            return baseClassStr + " bg-moss-100";
        case State.Error:
            return baseClassStr + " bg-moss-100";

    }
})

let isDisconnected = computed(() => {
    return props.state === State.Disconnected;
})


</script>