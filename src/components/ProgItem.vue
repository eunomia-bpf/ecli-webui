<template>
    <div class="bg-white items-center rounded-md w-full h-16 flex justify-normal my-1
         hover:bg-torinoko-50 pl-3 whitespace-nowrap">
        <div class="pl-3 text-2xl">
            <slot></slot>
        </div>


        <div class="flex items-center w-full justify-end mr-2 gap-3">

            <div class="px-3 text-xl rounded-xl bg-moss-100 py-1">Running</div>

            <n-popover trigger="hover">
                <template #trigger>
                    <btn @click="pause = !pause" text>
                        <n-icon size="20" color="#255359">
                            <Pause16Regular v-if="!pause" />
                            <Play16Regular v-if="pause" />
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
import { Open16Regular, Pause16Regular, Play16Regular, BookPulse24Regular } from '@vicons/fluent'
import { X } from '@vicons/tabler'
import { ref } from 'vue'
import btn from './Button.vue'

let pause = ref<boolean>(false);

</script>