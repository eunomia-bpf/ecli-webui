<template>
    <button @click="changeTab"
        class="flex items-center h-7 bg-customBg-100 rounded-sm hover:bg-moss-50 w-24 px-1 whitespace-nowrap">

        <div v-if="name == activeTab">
            <n-icon size="10" color="#255359" class="mr-1">
                <CircleDot />
            </n-icon>
        </div>

        <div class="w-24 truncate">
            {{ props.name }}
        </div>

        <div class="flex items-center justify-end w-full h-full pr-1">
            <n-button text @click="deleteTab">
                <n-icon>
                    <X />
                </n-icon>
            </n-button>
        </div>
    </button>
</template>


<script setup lang="ts">
import { X, CircleDot } from '@vicons/tabler'

let props = defineProps<{
    name: string
    activeTab: string
}>()

let emit = defineEmits<{
    (e: 'change-tab', name: string): void
    (e: 'delete-tab', name: string): void
}>()

const changeTab = () => {
    console.log("change tab to", props.name)
    emit('change-tab', props.name)
}
// FIXME: deleteTab is not working ?
const deleteTab = () => {
    console.log("delete tab", props.name)
    emit('delete-tab', props.name)
}
</script>
