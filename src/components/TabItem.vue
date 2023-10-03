<template>
    <button @click="changeTab"
        class="flex items-center h-7 bg-customBg-100 rounded-sm hover:bg-moss-50 w-24 px-1 whitespace-nowrap">

        <div v-if="id == activeTab">
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
    id: number
    name: string
    activeTab: number
}>()

let emit = defineEmits<{
    (e: 'change-tab', id: number): void
    (e: 'delete-tab', id: number): void
}>()

const changeTab = () => {
    console.log("change tab to", props.id)
    emit('change-tab', props.id)
}
// FIXME: deleteTab is not working ?
const deleteTab = () => {
    console.log("delete tab", props.id)
    emit('delete-tab', props.id)
}
</script>
